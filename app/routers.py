from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
from werkzeug.utils import secure_filename
import shutil
from pathlib import Path
from .function import *

main_bp = Blueprint('main', __name__) 
files_folder = Path(current_app.config.get('FILES_FOLDER', 'files')).resolve()

@main_bp.route('/')
def index():
    """index page"""
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    """manage page"""
    return render_template('manage.html')

@main_bp.route('/<path:name>')
def handle_file(name):
    """view or download file"""
    full_path = files_folder / name
    # 分辨文件和目录
    if full_path.is_file():
        return send_from_directory(full_path.parent, full_path.name)
    elif full_path.is_dir():
        return render_template('index.html', folder=name)
    return "404 Not Found", 404

@main_bp.route('/api/get_files', methods=['GET'])
def get_files():
    """get files list in a given folder"""
    # 获取请求路径
    target_path = files_folder / request.args.get('path', '')
    if not target_path.exists() or not target_path.is_dir():
        return jsonify({'error': '文件夹不存在'}), 404
    return jsonify(get_file_info(target_path))

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Processes file uploads"""
    try:
        if not (file := request.files.get('uploaded_file')):
            return jsonify({'error': 'No selected file'}), 400
        # 创建保存路径
        path = request.form.get('path', '')
        filename = secure_filename(Path(file.filename).name)
        save_path = files_folder / path / filename
        # 保存文件
        save_path.parent.mkdir(parents=True, exist_ok=True)
        file.save(save_path)
        print(f'Upload path: {save_path}')

        return jsonify({'success': 'Upload success', 'filename': filename}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main_bp.route('/api/delete', methods=['POST'])
def delete_file_func():
    file_path = files_folder / request.json.get('name', '')
    # 检查文件路径是否在允许的目录下
    if not file_path.resolve().is_relative_to(files_folder):
        return jsonify({'error': 'Permission denied.'}), 403

    try:
        if file_path.is_file():
            file_path.unlink()
        else:
            shutil.rmtree(file_path)  # 删除目录及其内容
            
        return jsonify({'success': '删除成功'}), 200
    except Exception as e:
        return jsonify({'error': f'删除错误: {str(e)}'}), 500