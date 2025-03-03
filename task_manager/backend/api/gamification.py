from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models.achievement import Achievement, AchievementType
from ..models.user import User
from pydantic import BaseModel

router = APIRouter()

class AchievementBase(BaseModel):
    title: str
    description: Optional[str] = None
    achievement_type: AchievementType
    icon_url: Optional[str] = None
    experience_reward: int = 50
    target_value: int

class AchievementCreate(AchievementBase):
    pass

class AchievementInDB(AchievementBase):
    id: int
    user_id: int
    is_unlocked: bool
    progress: int
    unlocked_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True

@router.get("/achievements", response_model=List[AchievementInDB])
async def get_achievements(
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user_id
    ).all()
    return achievements

@router.get("/achievements/{achievement_id}", response_model=AchievementInDB)
async def get_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user_id
    ).first()
    if achievement is None:
        raise HTTPException(status_code=404, detail="成就不存在")
    return achievement

@router.post("/achievements", response_model=AchievementInDB)
async def create_achievement(
    achievement: AchievementCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    db_achievement = Achievement(
        **achievement.dict(),
        user_id=current_user_id
    )
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

@router.put("/achievements/{achievement_id}/progress")
async def update_achievement_progress(
    achievement_id: int,
    progress: int,
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user_id
    ).first()
    if achievement is None:
        raise HTTPException(status_code=404, detail="成就不存在")
    
    if achievement.update_progress(progress):
        # 如果成就达成，更新用户经验值
        user = db.query(User).filter(User.id == current_user_id).first()
        if user:
            user.experience_points += achievement.experience_reward
            user.achievement_count += 1
            # 简单的等级计算逻辑：每1000经验值提升一级
            user.level = (user.experience_points // 1000) + 1
            db.commit()
        
        return {
            "message": "成就已解锁",
            "experience_gained": achievement.experience_reward,
            "new_level": user.level if user else None
        }
    
    return {"message": "进度已更新", "current_progress": progress}

@router.get("/user/level")
async def get_user_level(
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    # 计算距离下一级所需的经验值
    next_level_exp = (user.level * 1000)
    current_level_exp = user.experience_points - ((user.level - 1) * 1000)
    progress_percentage = (current_level_exp / 1000) * 100
    
    return {
        "current_level": user.level,
        "total_experience": user.experience_points,
        "experience_to_next_level": next_level_exp - current_level_exp,
        "level_progress": progress_percentage,
        "achievements_unlocked": user.achievement_count
    }