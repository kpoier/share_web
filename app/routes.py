from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
from pathlib import Path
from .function import *

# 创建蓝图
main_bp = Blueprint('main', __name__) 
files_folder = current_app.config.get('FILES_FOLDER', 'files')

@main_bp.route('/')
def index():
    """首页路由"""
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    """文件管理页面"""
    return render_template('manage.html')

@main_bp.route('/<name>')
def handle_file(name):
    """预览图片或下载文件"""
    return send_from_directory(files_folder, name)

@main_bp.route('/api/get_files')
def get_files():
    """获取文件列表API"""
    files = []
    for file_path in Path(files_folder).iterdir():
        if file_path.is_file():
            files.append({
                'name': file_path.name,
                'size': transform_datasize(file_path.stat().st_size),
            })
    return jsonify(files)

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if not (file := request.files.get('uploaded_file')):
        return jsonify({'error': 'No selected file'}), 400
    file.save(Path(files_folder) / file.filename)
    return jsonify({'success': 'Upload success', 'filename': file.filename}), 200

@main_bp.route('/api/delete', methods=['POST'])
def delete_file():
    """删除文件"""
    if delete_file_func(files_folder, request.json.get('name')):
        return jsonify({'success': 'Delete success'}), 200
    return jsonify({'error': 'Delete failed'}), 400