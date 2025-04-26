from urllib.parse import unquote
import shutil
from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
from werkzeug.utils import secure_filename
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

@main_bp.route('/<path:name>')
def handle_file(name):
    """view or download file"""
    full_path = Path(files_folder) / name
    # file
    if full_path.is_file():
        return send_from_directory(full_path.parent, full_path.name)
    # folder
    elif full_path.is_dir():
        return render_template('index.html', folder=name)
    # 404
    return "404 Not Found", 404

# framework json response
"""
json_response = {
    {"name": "file1.jpg", "size": "1.2MB", "type": "file"},
    {"name": "folder1", "size": "", "type": "folder"}
}
"""

@main_bp.route('/api/get_files', methods=['GET'])
def get_files():
    """get files list in a given folder"""
    path = request.args.get('path', '')
    path = unquote(path)
    target_path = Path(files_folder) / path

    if not target_path.exists() or not target_path.is_dir():
        return jsonify({'error': 'Folder not found'}), 404

    def get_file_info(path, base_path):
        files = []
        for file_path in path.iterdir():
            relative_path = file_path.relative_to(base_path)
            if file_path.is_file():
                files.append({
                    'name': str(relative_path),
                    'size': transform_datasize(file_path.stat().st_size),
                    'type': 'file'
                })
            elif file_path.is_dir():
                files.append({
                    'name': str(relative_path),
                    'size': '',
                    'type': 'folder'
                })
        return files

    files = get_file_info(target_path, target_path)
    return jsonify(files)


@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Processes file uploads"""
    try:
        if not (file := request.files.get('uploaded_file')):
            return jsonify({'error': 'No selected file'}), 400

        path = request.form.get('path', '')
        path = unquote(path)

        filename = secure_filename(Path(file.filename).name)

        save_path = Path(files_folder) / path / filename
        save_path.parent.mkdir(parents=True, exist_ok=True)
        file.save(save_path)

        print(f'Upload path: {path}')
        print(f'Upload file: {filename}')

        return jsonify({'success': 'Upload success', 'filename': filename}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main_bp.route('/api/delete', methods=['POST'])
def delete_file_func():
    relative_path = request.json.get('name', '')
    file_path = Path(files_folder) / relative_path

    if not str(file_path).startswith(str(Path(files_folder).resolve())):
        return jsonify({'error': 'Permission denied.'}), 403

    try:
        if file_path.is_file():
            file_path.unlink()  # delete file
        elif file_path.is_dir():
            shutil.rmtree(file_path)  # delete directory
        else:
            return jsonify({'error': 'Path does not exist'}), 400
        print(f'file type: {"file" if file_path.is_file() else "folder"}')
        print(f'Delete path: {relative_path}')
        return jsonify({'success': 'Delete success'}), 200
    except Exception as e:
        print(f"Error deleting {file_path}: {e}")
        return jsonify({'error': str(e)}), 500