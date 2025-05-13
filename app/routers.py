from flask import Blueprint, render_template, send_from_directory, request, jsonify, current_app
import shutil
from pathlib import Path
import urllib.parse
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
        raw_path = request.args.get('path', '')

        decoded_path = urllib.parse.unquote(raw_path)

        cleaned_path = decoded_path.strip('/')

        target_path = files_folder / cleaned_path

        if not target_path.exists():
            print(f"Path does not exist: {target_path}")
            return jsonify({'error': 'Folder not exist'}), 404
        if not target_path.is_dir():
            print(f"Path is not a directory: {target_path}")
            return jsonify({'error': 'Path is not a directory'}), 400

        files = get_file_info(target_path)
        print(f"Files in {target_path}: {files}")
        return jsonify(files)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def get_file_info(target_path):
    """Helper function to get file information"""
    files = []
    for item in target_path.iterdir():
        files.append({
            'name': item.name,
            'type': 'folder' if item.is_dir() else 'file',
            'size': item.stat().st_size if item.is_file() else ''
        })
    return files

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    """Processes file uploads"""
    try:
        # fetch the file from the request
        file = request.files.get('uploaded_file')
        if not file:
            return jsonify({'error': 'No selected file'}), 400

        # fetch the path from the request
        path = request.form.get('path', '')
        save_path = files_folder / path / file.filename

        # check if the path is within the allowed directory
        save_path.parent.mkdir(parents=True, exist_ok=True)

        # save the file
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
