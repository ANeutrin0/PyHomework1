import os

# 基本配置
DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-for-development-only'
BASEDIR = os.path.abspath(os.path.dirname(__file__))

# 数据库配置
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
    'sqlite:///' + os.path.join(BASEDIR, 'app.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False

# 游戏化配置
EXP_PER_TASK = 10  # 每完成一个任务获得的经验值
EXP_PER_HABIT = 5   # 每完成一次习惯获得的经验值
LEVEL_THRESHOLD = 100  # 升级所需经验值

# API配置
API_TITLE = '智能习惯追踪和任务管理系统API'
API_VERSION = 'v1'
API_DESCRIPTION = '提供习惯管理、任务管理、数据统计和游戏化功能的API'

# 邮件配置（用于提醒功能）
MAIL_SERVER = os.environ.get('MAIL_SERVER')
MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
ADMINS = ['admin@example.com']