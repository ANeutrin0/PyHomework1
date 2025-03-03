from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class AchievementType(enum.Enum):
    HABIT_STREAK = "habit_streak"  # 习惯连续完成
    TASK_COMPLETION = "task_completion"  # 任务完成数量
    LEVEL_UP = "level_up"  # 等级提升
    SPECIAL = "special"  # 特殊成就

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    achievement_type = Column(Enum(AchievementType), nullable=False)
    icon_url = Column(String)  # 成就图标URL
    experience_reward = Column(Integer, default=50)  # 获得成就奖励的经验值
    is_unlocked = Column(Boolean, default=False)  # 是否已解锁
    progress = Column(Integer, default=0)  # 当前进度
    target_value = Column(Integer, nullable=False)  # 目标值
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    unlocked_at = Column(DateTime(timezone=True))  # 解锁时间
    
    # 关系
    user = relationship("User", backref="achievements")
    
    def update_progress(self, new_progress: int) -> bool:
        """更新进度并检查是否达成"""
        self.progress = new_progress
        if not self.is_unlocked and self.progress >= self.target_value:
            self.unlock()
            return True
        return False
    
    def unlock(self):
        """解锁成就"""
        if not self.is_unlocked:
            self.is_unlocked = True
            self.unlocked_at = func.now()
            return self.experience_reward
        return 0