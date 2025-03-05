from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app, redirect, url_for
from .function import *
# 创建蓝图，用于组织相关路由
main_bp = Blueprint('main', __name__) 
files_folder = current_app.config.get('FILES_FOLDER', 'files')

@main_bp.route('/')
def index():
    """首页路由"""
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    """管理页面路由"""
    return render_template('manage.html')

@main_bp.route('/download/<name>')
def download_file(name):
    """文件下载路由"""
    return send_from_directory(files_folder, name, as_attachment=True)

@main_bp.route('/<name>')
def access_file(name):
    """文件访问路由 - 根据文件类型决定预览或下载"""
    if is_image(name):
        return render_template('image_view.html', name=name)
    else:
        return redirect(url_for('main.download_file', name=name))

@main_bp.route('/image/<name>')
def get_image(name):
    """获取图片内容（不作为附件）"""
    if not is_image(name):
        return "不是有效的图片文件", 400
    return send_from_directory(files_folder, name)

@main_bp.route('/api/get_files')
def get_file():
    """获取文件列表"""
    return jsonify(get_file_info(files_folder)), 200

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