from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models.task import Task, PriorityType, TaskStatus, TaskType
from pydantic import BaseModel

router = APIRouter()

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    task_type: TaskType = TaskType.ONCE
    priority: PriorityType = PriorityType.MEDIUM
    due_date: Optional[datetime] = None
    tags: Optional[str] = None
    experience_reward: Optional[int] = 10

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    status: Optional[TaskStatus] = None

class TaskInDB(TaskBase):
    id: int
    user_id: int
    status: TaskStatus
    created_at: datetime
    updated_at: Optional[datetime]
    completed_at: Optional[datetime]

    class Config:
        orm_mode = True

@router.post("/", response_model=TaskInDB)
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1  # 临时使用固定用户ID
):
    db_task = Task(**task.dict(), user_id=current_user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskInDB])
async def get_tasks(
    skip: int = 0,
    limit: int = 100,
    status: Optional[TaskStatus] = None,
    task_type: Optional[TaskType] = None,
    priority: Optional[PriorityType] = None,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    query = db.query(Task).filter(Task.user_id == current_user_id)
    
    if status:
        query = query.filter(Task.status == status)
    if task_type:
        query = query.filter(Task.task_type == task_type)
    if priority:
        query = query.filter(Task.priority == priority)
        
    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.get("/{task_id}", response_model=TaskInDB)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    return task

@router.put("/{task_id}", response_model=TaskInDB)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.post("/{task_id}/complete", response_model=TaskInDB)
async def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 完成任务并获得经验值
    experience_gained = db_task.complete()
    
    # 检查是否需要自动归档
    db_task.auto_archive_if_completed()
    
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    db.delete(db_task)
    db.commit()
    return {"message": "任务已删除"}

@router.post("/{task_id}/complete")
async def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    exp_reward = db_task.complete()
    db.commit()
    return {
        "message": "任务已完成",
        "experience_gained": exp_reward
    }

@router.post("/{task_id}/archive")
async def archive_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user_id
    ).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    db_task.archive()
    db.commit()
    return {"message": "任务已归档"}