# 文件分享网站

[![English](https://img.shields.io/badge/English-Click%20to%20switch-blue.svg)](README.en.md)

一个简洁高效的文件分享Web应用，支持拖放上传、文件管理和快速分享。

## 功能特点

- 🗂️ 文件管理界面
- 🔗 简单的文件分享链接
- 📱 响应式设计，适配各种设备
- ✨ 拖放式文件上传
- 📊 实时上传进度显示
- 🐳 Docker支持，便于部署


## 安装与运行

### 方法一: 使用 Docker (推荐)

1. **方式 A: 使用 Docker 命令**
   ```bash
   docker run -d \
     --name share-web \
     -p 8050:8050 \
     -v /path/to/files:/app/files \ #修改 /path/to/files 为你的本地路径
     -e FLASK_DEBUG=0 \
     --restart unless-stopped \
     kpoier/share-web:latest
   ```

   **方式 B: 使用 Docker Compose**
   ```bash
   # 下载 docker-compose.yaml
   wget https://raw.githubusercontent.com/kpoier/share_web/master/docker/docker-compose.yaml
   
   # 运行命令
   docker-compose up -d
   ```

2. 访问 `http://localhost:8050` 开始使用


### 方法二: 本地运行

1. 确保已安装 Python (推荐 Python 3.8+)

2. **运行命令**
   ```bash
   # 克隆仓库
   git clone https://github.com/kpoier/share_web
   cd share_web

   # 安装依赖
   pip install -r docker/requirements.txt

   # 运行应用
   python run.py
   ```

3. 访问 `http://localhost:8050` 开始使用

4. 自定义配置

   ```python
   # 修改 `config.py` 文件可调整应用设置:
   class Config:
      SECRET_KEY = '你的密钥'  # 更改为随机字符串
      BASE_DIR = os.path.abspath(os.path.dirname(__file__))
      FILES_FOLDER = os.path.join(BASE_DIR, 'files')  # 可更改文件存储位置
   ```

## 使用说明

1. **上传文件或文件夹**: 
   - 点击"Upload"按钮选择文件或文件夹
   - 或直接拖放文件到浏览器窗口

2. **管理文件**:
   - 访问 `/manage` 路径可进入文件管理页面
   - 管理页面可删除不需要的文件

## 项目结构

```
share_website/
├── app/                   # Flask应用核心
├── static/
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   └── img/               # 图像资源
├── templates/             # HTML模板
├── docker/                # Docker相关文件
├── config.py              # 应用配置
└── run.py                 # 应用入口点
```

## 技术栈

- **后端**: Python, Flask
- **前端**: HTML, CSS, JavaScript
- **容器化**: Docker