from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class PriorityType(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class TaskType(enum.Enum):
    DAILY = "daily"  # 每日任务
    ONCE = "once"   # 一次性待办事项

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    task_type = Column(Enum(TaskType), default=TaskType.ONCE)  # 任务类型
    priority = Column(Enum(PriorityType), default=PriorityType.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)
    due_date = Column(DateTime(timezone=True))
    tags = Column(String)  # 以逗号分隔的标签字符串
    
    # 游戏化相关字段
    experience_reward = Column(Integer, default=10)  # 完成任务获得的经验值
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))  # 完成时间
    
    # 关系
    user = relationship("User", backref="tasks")
    
    def complete(self):
        """完成任务"""
        self.status = TaskStatus.COMPLETED
        self.completed_at = func.now()
        return self.experience_reward  # 返回获得的经验值
    
    def archive(self):
        """归档任务"""
        self.status = TaskStatus.ARCHIVED
    
    def reopen(self):
        """重新打开任务"""
        self.status = TaskStatus.TODO
        self.completed_at = None

    def auto_archive_if_completed(self):
        """检查并自动归档已完成的任务"""
        if self.status == TaskStatus.COMPLETED:
            # 对于每日任务，第二天自动归档
            if self.task_type == TaskType.DAILY and self.completed_at:
                next_day = self.completed_at + timedelta(days=1)
                if func.now() >= next_day:
                    self.archive()
            # 对于一次性任务，完成后立即归档
            elif self.task_type == TaskType.ONCE:
                self.archive()