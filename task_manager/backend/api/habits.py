from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from ..database import get_db
from ..models.habit import Habit, FrequencyType
from pydantic import BaseModel

router = APIRouter()

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    frequency_type: FrequencyType
    frequency_value: int = 1
    reminder_time: Optional[datetime] = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    is_active: Optional[bool] = None

class HabitInDB(HabitBase):
    id: int
    user_id: int
    is_active: bool
    total_completions: int
    current_streak: int
    best_streak: int
    created_at: datetime
    updated_at: Optional[datetime]
    last_completed_at: Optional[datetime]

    class Config:
        orm_mode = True

@router.post("/", response_model=HabitInDB)
async def create_habit(
    habit: HabitCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1  # 临时使用固定用户ID，后续需要通过认证获取
):
    db_habit = Habit(
        **habit.dict(),
        user_id=current_user_id
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.get("/", response_model=List[HabitInDB])
async def get_habits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = 1  # 临时使用固定用户ID
):
    habits = db.query(Habit).filter(
        Habit.user_id == current_user_id
    ).offset(skip).limit(limit).all()
    return habits

@router.get("/{habit_id}", response_model=HabitInDB)
async def get_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user_id
    ).first()
    if habit is None:
        raise HTTPException(status_code=404, detail="习惯不存在")
    return habit

@router.put("/{habit_id}", response_model=HabitInDB)
async def update_habit(
    habit_id: int,
    habit_update: HabitUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user_id
    ).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="习惯不存在")
    
    for field, value in habit_update.dict(exclude_unset=True).items():
        setattr(db_habit, field, value)
    
    db.commit()
    db.refresh(db_habit)
    return db_habit

@router.delete("/{habit_id}")
async def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user_id
    ).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="习惯不存在")
    
    db.delete(db_habit)
    db.commit()
    return {"message": "习惯已删除"}

@router.post("/{habit_id}/complete")
async def complete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user_id
    ).first()
    if db_habit is None:
        raise HTTPException(status_code=404, detail="习惯不存在")
    
    db_habit.update_streak(True)
    db.commit()
    return {"message": "习惯已完成", "current_streak": db_habit.current_streak}