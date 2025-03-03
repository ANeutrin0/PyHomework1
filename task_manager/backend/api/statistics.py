from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Optional
from datetime import datetime, timedelta
from ..database import get_db
from ..models.statistics import Statistics
from ..models.habit import Habit
from ..models.task import Task, TaskStatus
from pydantic import BaseModel

router = APIRouter()

class StatisticsResponse(BaseModel):
    habit_stats: Dict
    task_stats: Dict
    gamification_stats: Dict

    class Config:
        orm_mode = True

@router.get("/summary", response_model=StatisticsResponse)
async def get_statistics_summary(
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    # 获取或创建统计记录
    stats = db.query(Statistics).filter(
        Statistics.user_id == current_user_id
    ).first()
    
    if not stats:
        stats = Statistics(user_id=current_user_id)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    
    # 计算习惯统计
    habits_query = db.query(Habit).filter(Habit.user_id == current_user_id)
    total_habits = habits_query.count()
    completed_habits = habits_query.filter(Habit.total_completions > 0).count()
    longest_streak = db.query(func.max(Habit.best_streak)).filter(
        Habit.user_id == current_user_id
    ).scalar() or 0
    
    habit_stats = {
        "total_habits": total_habits,
        "completed_habits": completed_habits,
        "completion_rate": (completed_habits / total_habits * 100) if total_habits > 0 else 0,
        "longest_streak": longest_streak
    }
    
    # 计算任务统计
    tasks_query = db.query(Task).filter(Task.user_id == current_user_id)
    total_tasks = tasks_query.count()
    completed_tasks = tasks_query.filter(Task.status == TaskStatus.COMPLETED).count()
    
    # 计算平均完成时间
    completed_tasks_with_duration = tasks_query.filter(
        Task.status == TaskStatus.COMPLETED,
        Task.completed_at.isnot(None)
    ).all()
    
    total_duration = sum(
        (task.completed_at - task.created_at).total_seconds() / 3600
        for task in completed_tasks_with_duration
        if task.completed_at and task.created_at
    )
    
    avg_duration = (
        total_duration / len(completed_tasks_with_duration)
        if completed_tasks_with_duration
        else 0
    )
    
    task_stats = {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        "average_completion_time": avg_duration
    }
    
    # 更新统计数据
    stats.update_habit_stats(
        completion_rate=habit_stats["completion_rate"],
        total_completed=completed_habits,
        longest_streak=longest_streak
    )
    
    stats.update_task_stats(
        completion_rate=task_stats["completion_rate"],
        total_completed=completed_tasks,
        avg_duration=avg_duration
    )
    
    db.commit()
    
    return {
        "habit_stats": habit_stats,
        "task_stats": task_stats,
        "gamification_stats": {
            "total_experience": stats.total_experience_gained,
            "achievements_unlocked": stats.achievements_unlocked
        }
    }

@router.get("/trends")
async def get_statistics_trends(
    period: str = "week",  # week, month, year
    db: Session = Depends(get_db),
    current_user_id: int = 1
):
    today = datetime.now()
    
    if period == "week":
        start_date = today - timedelta(days=7)
    elif period == "month":
        start_date = today - timedelta(days=30)
    else:  # year
        start_date = today - timedelta(days=365)
    
    # 获取习惯完成趋势
    habits_trend = db.query(
        func.date(Habit.last_completed_at).label("date"),
        func.count().label("count")
    ).filter(
        Habit.user_id == current_user_id,
        Habit.last_completed_at >= start_date
    ).group_by(
        func.date(Habit.last_completed_at)
    ).all()
    
    # 获取任务完成趋势
    tasks_trend = db.query(
        func.date(Task.completed_at).label("date"),
        func.count().label("count")
    ).filter(
        Task.user_id == current_user_id,
        Task.status == TaskStatus.COMPLETED,
        Task.completed_at >= start_date
    ).group_by(
        func.date(Task.completed_at)
    ).all()
    
    return {
        "habits_trend": [
            {"date": str(date), "count": count}
            for date, count in habits_trend
        ],
        "tasks_trend": [
            {"date": str(date), "count": count}
            for date, count in tasks_trend
        ]
    }