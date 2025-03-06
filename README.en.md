# File Sharing Website

[![简体中文](https://img.shields.io/badge/简体中文-点击切换-blue.svg)](README.md)

A simple and efficient file sharing web application that supports drag-and-drop uploads, file management, and quick sharing.

## Features

- 🗂️ File management interface
- 🔗 Simple file sharing links
- 📱 Responsive design for all devices
- ✨ Drag and drop file uploads
- 📊 Real-time upload progress display
- 🐳 Docker support for easy deployment

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Containerization**: Docker

## Installation & Setup

### Method 1: Using Docker (Recommended)

1. Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed

2. Clone the repository
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. Start the application
   ```bash
   docker-compose up -d
   ```

4. Access `http://localhost:8050` to begin

### Method 2: Local Installation

1. Make sure you have Python installed

2. Clone the repository
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. Install dependencies
   ```bash
   pip install Flask
   ```

4. Run the application
   ```bash
   python run.py
   ```

5. Access `http://localhost:8050` to begin

## Project Structure

```
share_website/
├── app/
│   ├── __init__.py         # Flask application initialization
│   ├── function.py         # Utility functions
│   ├── routes.py           # Route definitions
│   └── templates/          # Page templates
├── static/
│   ├── css/                # Style files
│   ├── js/                 # JavaScript files
│   └── img/                # Image resources
├── files/                  # Uploaded file storage directory
├── config.py               # Application configuration
├── docker-compose.yaml     # Docker Compose configuration
├── dockerfile              # Docker build file
├── requirements.txt        # Dependencies list
└── run.py                  # Application entry point
```

## Usage Guide

1. **Upload Files**:
   - Click the "Upload File" button to select files
   - Or drag and drop files directly onto the browser window

2. **View Files**:
   - All uploaded files are displayed in the main page list
   - Click the filename to download or view the file

3. **Manage Files**:
   - Visit the `/manage` path to enter the file management page
   - Delete unwanted files from the management page

## Custom Configuration

Edit the `config.py` file to adjust application settings:

```python
class Config:
    SECRET_KEY = 'your_secret_key'  # Change to a random string
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FILES_FOLDER = os.path.join(BASE_DIR, 'files')  # Change file storage location
```
