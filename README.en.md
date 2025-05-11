# File Sharing Website

[![中文](https://img.shields.io/badge/中文-切换语言-blue.svg)](README.md)

A clean and efficient file sharing web application that supports drag-and-drop uploads, file management, and quick sharing.

## Features

- 🗂️ File management interface
- 🔗 Simple file sharing links
- 📱 Responsive design, compatible with various devices
- ✨ Drag-and-drop file uploads
- 📊 Real-time upload progress display
- 🐳 Docker support for easy deployment

## Installation & Running

### Method 1: Using Docker (Recommended)

1. **Option A: Using Docker Command**
   ```bash
   docker run -d \
     --name share-web \
     -p 8050:8050 \
     -v /path/to/files:/app/files \ #change /path/to/files to your local path
     -e FLASK_DEBUG=0 \
     --restart unless-stopped \
     kpoier/share-web:latest
   ```

   **Option B: Using Docker Compose**
   ```bash
   # Download docker-compose.yaml
   wget https://raw.githubusercontent.com/kpoier/share_web/master/docker/docker-compose.yaml
   
   # Run command
   docker-compose up -d
   ```

2. Visit `http://localhost:8050` to start using the application


### Method 2: Local Deployment

1. Ensure Python is installed (Python 3.8+ recommended)

2. **Run commands**
   ```bash
   # Clone repository
   git clone https://github.com/kpoier/share_web
   cd share_web

   # Install dependencies
   pip install -r docker/requirements.txt

   # Run application
   python run.py
   ```

3. Visit `http://localhost:8050` to start using the application

4. Custom Configuration

   ```python
   # Modify `config.py` file to adjust application settings:
   class Config:
      SECRET_KEY = 'your_secret_key'  # Change to a random string
      BASE_DIR = os.path.abspath(os.path.dirname(__file__))
      FILES_FOLDER = os.path.join(BASE_DIR, 'files')  # Can change file storage location
   ```

## Usage Instructions

1. **Upload Files or Folders**: 
   - Click the "Upload" button to select files or folders
   - Or directly drag and drop files into the browser window

2. **Manage Files**:
   - Visit the `/manage` path to enter the file management page
   - The management page allows you to delete unwanted files

## Project Structure

```
share_website/
├── app/                   # Flask application core
├── static/
│   ├── css/               # Style files
│   ├── js/                # JavaScript files
│   └── img/               # Image resources
├── templates/             # HTML templates
├── docker/                # Docker-related files
├── config.py              # Application configuration
└── run.py                 # Application entry point
```

## Technology Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker
