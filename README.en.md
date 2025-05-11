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

1. Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed

2. Run using Docker (choose one of the following methods):

   **Option A: Using Docker Command**
   ```bash
   docker run -d \
     --name share-web \
     -p 8050:8050 \
     -v /path/to/files:/app/files \
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

3. Visit http://localhost:8050 to start using the application

4. **Docker Parameter Explanation**:
   - `--name share-web`: Container name
   - `-p 8050:8050`: Port mapping (host:container)
   - `-v /path/to/files:/app/files`: File storage path mapping (change `/path/to/files` to your local path)
   - `-e FLASK_DEBUG=0`: Environment variable setting
   - `--restart unless-stopped`: Container restart policy

### Method 2: Local Deployment

1. Ensure Python is installed (Python 3.8+ recommended)

2. Clone the repository
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. Install dependencies
   ```bash
   pip install -r docker/requirements.txt
   ```

4. Run the application
   ```bash
   python run.py
   ```

5. Visit `http://localhost:8050` to start using the application

## Project Structure

```
share_website/
├── app/
│   ├── __init__.py         # Flask application initialization
│   ├── function.py         # Common functionality functions
│   ├── routers.py          # Route definitions
├── static/
│   ├── css/                # Style files
│   │   ├── button.css      # Button styles
│   │   ├── files.css       # File list styles
│   │   ├── index.css       # Homepage styles
│   │   └── upload.css      # Upload progress styles
│   ├── js/                 # JavaScript files
│   │   ├── drag_and_drop.js  # Drag-and-drop functionality
│   │   ├── file_input.js     # File input handling
│   │   ├── file_list.js      # File list generation
│   │   ├── main.js           # Main JS entry
│   │   ├── manage.js         # Management page JS
│   │   └── upload.js         # File upload handling
│   └── img/                # Image resources
├── templates/              # HTML templates
│   ├── index.html          # Homepage template
│   └── manage.html         # Management page template
├── docker/                 # Docker-related files
│   ├── docker-compose.yaml # Docker Compose configuration
│   ├── dockerfile          # Docker build file
│   └── requirements.txt    # Dependency list
├── config.py               # Application configuration
└── run.py                  # Application entry point
```

## Usage Instructions

1. **Upload Files**: 
   - Click the "Upload File" button to select files
   - Or directly drag and drop files into the browser window

2. **View Files**:
   - All uploaded files will be displayed in the homepage list
   - Click on the filename to download or view the file

3. **Manage Files**:
   - Visit the `/manage` path to enter the file management page
   - The management page allows you to delete unwanted files

## Custom Configuration

Modify the `config.py` file to adjust application settings:

```python
class Config:
    SECRET_KEY = 'your_secret_key'  # Change to a random string
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FILES_FOLDER = os.path.join(BASE_DIR, 'files')  # Can change file storage location
```

## Technology Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker
