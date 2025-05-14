from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
import shutil
from pathlib import Path
from urllib.parse import unquote
from .function import get_file_info

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

    # Check if the path is within the allowed directory
    if full_path.is_file():
        return send_from_directory(full_path.parent, full_path.name)
    elif full_path.is_dir():
        return render_template('index.html', folder=name)
    return "404 Not Found", 404

@main_bp.route('/api/get_files', methods=['GET'])
def get_files():
    """Get files list in a given folder"""
    try:
        # fetch the path from the request
        target_path = files_folder / unquote(request.args.get('path', '')).strip('/')
        if not target_path.exists() or not target_path.is_dir():
            return jsonify({'error': 'Folder not exist'}), 404
        
        return jsonify(get_file_info(target_path))
    except Exception as e:
        print(f"Error processing directory {target_path}: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Processes file uploads"""
    try:
        # fetch the file from the request
        if not (file := request.files.get('uploaded_file')):
            return jsonify({'error': 'No selected file'}), 400

        # fetch the path from the request
        path = request.form.get('path', '')
        save_path = files_folder / path / file.filename

        # check if the path is within the allowed directory
        save_path.parent.mkdir(parents=True, exist_ok=True)
        file.save(save_path)
        print(f'Upload path: {save_path}')

        return jsonify({'success': 'Upload success', 'filename': file.filename}), 200
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@main_bp.route('/api/delete', methods=['POST'])
def delete_file_func():
    file_path = files_folder / request.json.get('name', '')

    # Check if the path is within the allowed directory
    if not file_path.resolve().is_relative_to(files_folder):
        return jsonify({'error': 'Permission denied.'}), 403

    try:
        if file_path.is_file():
            file_path.unlink()
        else:
            shutil.rmtree(file_path)

        return jsonify({'success': 'FINSHED'}), 200
    except Exception as e:
        return jsonify({'error': f'ERROR: {str(e)}'}), 500
