import os

class Config:
    SECRET_KEY = 'secret_key'
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))