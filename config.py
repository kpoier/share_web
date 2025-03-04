import os

class Config:
    # 密钥，用于会话安全等
    SECRET_KEY = 'secret_key'
    # 项目根目录的绝对路径
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FILES_FOLDER = os.path.join(BASE_DIR, 'files')