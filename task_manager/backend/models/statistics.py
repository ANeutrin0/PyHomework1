from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Statistics(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 习惯相关统计
    habit_completion_rate = Column(Float, default=0.0)  # 习惯完成率
    total_habits_completed = Column(Integer, default=0)  # 总完成习惯数
    longest_habit_streak = Column(Integer, default=0)  # 最长习惯连续天数
    habit_categories = Column(JSON)  # 习惯分类统计
    
    # 任务相关统计
    task_completion_rate = Column(Float, default=0.0)  # 任务完成率
    total_tasks_completed = Column(Integer, default=0)  # 总完成任务数
    tasks_by_priority = Column(JSON)  # 按优先级统计的任务数
    tasks_by_status = Column(JSON)  # 按状态统计的任务数
    average_task_duration = Column(Float)  # 平均任务完成时间（小时）
    
    # 游戏化相关统计
    total_experience_gained = Column(Integer, default=0)  # 总获得经验值
    achievements_unlocked = Column(Integer, default=0)  # 解锁的成就数
    
    # 时间维度统计
    daily_stats = Column(JSON)  # 每日统计数据
    weekly_stats = Column(JSON)  # 每周统计数据
    monthly_stats = Column(JSON)  # 每月统计数据
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关系
    user = relationship("User", backref="statistics")
    
    def update_habit_stats(self, completion_rate: float, total_completed: int, longest_streak: int):
        """更新习惯统计数据"""
        self.habit_completion_rate = completion_rate
        self.total_habits_completed = total_completed
        self.longest_habit_streak = longest_streak
    
    def update_task_stats(self, completion_rate: float, total_completed: int, avg_duration: float):
        """更新任务统计数据"""
        self.task_completion_rate = completion_rate
        self.total_tasks_completed = total_completed
        self.average_task_duration = avg_duration
    
    def update_gamification_stats(self, exp_gained: int, achievements: int):
        """更新游戏化统计数据"""
        self.total_experience_gained = exp_gained
        self.achievements_unlocked = achievements