from flask import Flask, jsonify
from flask_cors import CORS

# 创建Flask应用实例
app = Flask(__name__)
CORS(app)  # 启用跨域资源共享

# 配置
app.config.from_object('config')

# 路由
@app.route('/')
def index():
    return jsonify({
        'status': 'success',
        'message': '智能习惯追踪和任务管理系统API服务运行中'
    })

# 注册蓝图
from api.habits import habits_bp
from api.tasks import tasks_bp
from api.statistics import stats_bp
from api.gamification import game_bp

app.register_blueprint(habits_bp, url_prefix='/api/habits')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(stats_bp, url_prefix='/api/statistics')
app.register_blueprint(game_bp, url_prefix='/api/gamification')

# 错误处理
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'status': 'error',
        'message': '请求的资源不存在'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'status': 'error',
        'message': '服务器内部错误'
    }), 500

if __name__ == '__main__':
    app.run(debug=True)