from flask import Flask
from pathlib import Path

def create_app():
    """创建并配置Flask应用"""
    # 初始化Flask应用，设置静态文件目录
    app = Flask(__name__, static_folder='../static', static_url_path='/static')
    # 从config.py加载配置
    app.config.from_object('config.Config')
    
    # 确保files目录存在，如果不存在则创建
    files_dir = Path(app.config['FILES_FOLDER'])
    files_dir.mkdir(parents=True, exist_ok=True)

    # 在应用中注册蓝图
    with app.app_context():
        from .routers import main_bp
        app.register_blueprint(main_bp)

    return app