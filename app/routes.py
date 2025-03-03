from flask import Blueprint, render_template, send_from_directory, request, jsonify
import os
from .function import transform_datasize

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/manage')
def manage():
    return render_template('manage.html')

@main_bp.route('/share/<name>')
def share(name):
    file_path = os.path.join(os.path.dirname(__file__), '..', 'files', name)
    if not os.path.exists(file_path):
        return f"File {file_path} not found", 404
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'files'), name, as_attachment=True)

@main_bp.route('/api/get_files')
def get_file():
    files = os.listdir('files')
    lists = []
    for name in files:
        size = os.path.getsize(os.path.join('files', name))
        lists.append({'name': name, 'size': transform_datasize(size)})
    return lists

@main_bp.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file.save(os.path.join('files', file.filename))
    return jsonify({'success': 'Upload success'}), 200

@main_bp.route('/api/delete', methods=['POST'])
def delete_file():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'No file name provided'}), 400
    file_path = os.path.join(os.path.dirname(__file__), '..', 'files', name)
    if not os.path.exists(file_path):
        return jsonify({'error': f"File {file_path} not found"}), 404
    os.remove(file_path)
    return jsonify({'success': 'Delete success'}), 200