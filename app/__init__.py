from flask import Flask
import os

def create_app():
    """创建并配置Flask应用"""
    # 初始化Flask应用，设置静态文件目录
    app = Flask(__name__, static_folder='../static', static_url_path='/static')
    # 从config.py加载配置
    app.config.from_object('config.Config')
    
    # 确保files目录存在，如果不存在则创建
    files_dir = app.config['FILES_FOLDER']
    if not os.path.exists(files_dir):
        os.makedirs(files_dir)

    # 在应用中注册蓝图
    with app.app_context():
        from .routes import main_bp
        app.register_blueprint(main_bp)

    return app