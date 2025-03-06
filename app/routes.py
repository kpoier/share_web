from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
from pathlib import Path
from .function import *

main_bp = Blueprint('main', __name__) 
files_folder = current_app.config.get('FILES_FOLDER', 'files')

@main_bp.route('/')
def index():
    """index page"""
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    """manage page"""
    return render_template('manage.html')

@main_bp.route('/<name>')
def handle_file(name):
    """view picture or save file"""
    return send_from_directory(files_folder, name, as_attachment=True)

@main_bp.route('/api/get_files')
def get_files():
    """git files list"""
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
    """processes file uploads"""
    if not (file := request.files.get('uploaded_file')):
        return jsonify({'error': 'No selected file'}), 400
    file.save(Path(files_folder) / file.filename)
    return jsonify({'success': 'Upload success', 'filename': file.filename}), 200

@main_bp.route('/api/delete', methods=['POST'])
def delete_file():
    """delete file"""
    if delete_file_func(files_folder, request.json.get('name')):
        return jsonify({'success': 'Delete success'}), 200
    return jsonify({'error': 'Delete failed'}), 400

@main_bp.route('/favicon.ico')
def favicon():
    """processes requests for favicon.ico"""
    return send_from_directory('static', 'img/favicon.ico')