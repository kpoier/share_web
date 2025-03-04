from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
import os
from .function import transform_datasize

# 创建蓝图，用于组织相关路由
main_bp = Blueprint('main', __name__) 
files_folder = current_app.config.get('FILES_FOLDER', 'files')

@main_bp.route('/')
def index():
    """首页路由，显示文件共享界面"""
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    """管理页面路由，用于管理已上传文件"""
    return render_template('manage.html')

@main_bp.route('/share/<name>')
def share(name):
    """文件下载路由"""
    file_path = os.path.join(files_folder, name)
    if not os.path.exists(file_path):
        return f"File {file_path} not found", 404
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'files'), name, as_attachment=True)

@main_bp.route('/api/get_files')
def get_file():
    """API路由，获取文件列表"""
    lists = []
    files = os.listdir(files_folder)
    for name in files:
        file_path = os.path.join(files_folder, name)
        size = os.path.getsize(file_path)
        lists.append({'name': name, 'size': transform_datasize(size)})
    return lists

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """API路由，处理文件上传"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file.save(os.path.join('files', file.filename))
    return jsonify({'success': 'Upload success'}), 200

@main_bp.route('/api/delete', methods=['POST'])
def delete_file():
    """API路由，删除文件"""
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'No file name provided'}), 400
    file_path = os.path.join(files_folder, name)
    if not os.path.exists(file_path):
        return jsonify({'error': f"File {file_path} not found"}), 404
    os.remove(file_path)
    return jsonify({'success': 'Delete success'}), 200