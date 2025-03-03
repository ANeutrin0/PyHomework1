from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class FrequencyType(enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    frequency_type = Column(Enum(FrequencyType), nullable=False)
    frequency_value = Column(Integer, default=1)  # 例如：每周3次则为3
    reminder_time = Column(DateTime(timezone=True))  # 提醒时间
    is_active = Column(Boolean, default=True)
    
    # 统计数据
    total_completions = Column(Integer, default=0)  # 总完成次数
    current_streak = Column(Integer, default=0)  # 当前连续完成次数
    best_streak = Column(Integer, default=0)  # 最佳连续完成次数
    last_completed_at = Column(DateTime(timezone=True))  # 最后一次完成时间
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User", backref="habits")
    
    def update_streak(self, completed: bool):
        """更新连续完成记录"""
        if completed:
            self.total_completions += 1
            self.current_streak += 1
            self.best_streak = max(self.current_streak, self.best_streak)
            self.last_completed_at = func.now()
        else:
            self.current_streak = 0