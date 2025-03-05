from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
from pathlib import Path
from .function import transform_datasize, is_image, delete_file_func

# 创建蓝图
main_bp = Blueprint('main', __name__) 
files_folder = current_app.config.get('FILES_FOLDER', 'files')

@main_bp.route('/')
def index():
    """首页路由"""
    return render_template('index.html')

@main_bp.route('/<name>')
def handle_file(name):
    """预览图片或下载文件"""
    file_path = Path(files_folder) / name
    if is_image(name):
        return render_template('image_view.html', name=name)
    return send_from_directory(files_folder, name, as_attachment=True)

@main_bp.route('/image/<name>')
def get_image(name):
    """获取图片资源"""
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
                'isImage': is_image(file_path.name)
            })
    return jsonify(files)

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if not (file := request.files.get('uploaded_file')):
        return jsonify({'error': 'No selected file'}), 400
    print(f"上传文件：{file.filename}")        
    file.save(files_folder + '/' + file.filename)
    return jsonify({'success': 'Upload success', 'filename': file.filename}), 200

@main_bp.route('/api/delete', methods=['POST'])
def delete_file():
    """删除文件"""
    if delete_file_func(files_folder, request.json.get('name')):
        return jsonify({'success': 'Delete success'}), 200
    return jsonify({'error': 'Delete failed'}), 400