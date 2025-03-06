import os

class Config:
    SECRET_KEY = 'secret_key'

    # absolute path to the directory where the app is located
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FILES_FOLDER = os.path.join(BASE_DIR, 'files')