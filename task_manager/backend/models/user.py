from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # 游戏化相关字段
    experience_points = Column(Integer, default=0)  # 经验值
    level = Column(Integer, default=1)  # 等级
    achievement_count = Column(Integer, default=0)  # 获得的成就数量
    
    # 时间戳
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @property
    def password(self):
        raise AttributeError('密码不可读')

    @password.setter
    def password(self, password):
        self.hashed_password = pwd_context.hash(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.hashed_password)