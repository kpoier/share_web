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

1. 确保已安装 [Docker](https://www.docker.com/) 和 Docker Compose

2. 使用 Docker 运行 (选择以下任一方式):

   **方式 A: 使用 Docker 命令**
   ```bash
   docker run -d \
     --name share-web \
     -p 8050:8050 \
     -v /path/to/files:/app/files \
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

3. 访问 http://localhost:8050 开始使用

4. **Docker 参数说明**:
   - `--name share-web`: 容器名称
   - `-p 8050:8050`: 端口映射 (主机:容器)
   - `-v /path/to/files:/app/files`: 文件存储路径映射 (修改 `/path/to/files` 为你的本地路径)
   - `-e FLASK_DEBUG=0`: 环境变量设置
   - `--restart unless-stopped`: 容器重启策略


### 方法二: 本地运行

1. 确保已安装 Python (推荐 Python 3.8+)

2. 克隆仓库
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. 安装依赖
   ```bash
   pip install -r docker/requirements.txt
   ```

4. 运行应用
   ```bash
   python run.py
   ```

5. 访问 `http://localhost:8050` 开始使用

## 项目结构

```
share_website/
├── app/
│   ├── [__init__.py](http://_vscodecontentref_/1)         # Flask应用初始化
│   ├── [function.py](http://_vscodecontentref_/2)         # 通用功能函数
│   ├── [routers.py](http://_vscodecontentref_/3)          # 路由定义
├── static/
│   ├── css/                # 样式文件
│   │   ├── [button.css](http://_vscodecontentref_/4)      # 按钮样式
│   │   ├── [files.css](http://_vscodecontentref_/5)       # 文件列表样式
│   │   ├── [index.css](http://_vscodecontentref_/6)       # 主页样式
│   │   └── [upload.css](http://_vscodecontentref_/7)      # 上传进度样式
│   ├── js/                 # JavaScript文件
│   │   ├── [drag_and_drop.js](http://_vscodecontentref_/8)  # 拖放功能
│   │   ├── [file_input.js](http://_vscodecontentref_/9)     # 文件输入处理
│   │   ├── [file_list.js](http://_vscodecontentref_/10)      # 文件列表生成
│   │   ├── [main.js](http://_vscodecontentref_/11)           # 主要JS入口
│   │   ├── [manage.js](http://_vscodecontentref_/12)         # 管理页面JS
│   │   └── [upload.js](http://_vscodecontentref_/13)         # 文件上传处理
│   └── img/                # 图像资源
├── templates/              # HTML模板
│   ├── [index.html](http://_vscodecontentref_/14)          # 主页模板
│   └── [manage.html](http://_vscodecontentref_/15)         # 管理页面模板
├── docker/                 # Docker相关文件
│   ├── [docker-compose.yaml](http://_vscodecontentref_/16) # Docker Compose配置
│   ├── dockerfile          # Docker构建文件
│   └── [requirements.txt](http://_vscodecontentref_/17)    # 依赖列表
├── [config.py](http://_vscodecontentref_/18)               # 应用配置
└── [run.py](http://_vscodecontentref_/19)                  # 应用入口点
```

## 使用说明

1. **上传文件**: 
   - 点击"Upload File"按钮选择文件
   - 或直接拖放文件到浏览器窗口

2. **查看文件**:
   - 所有上传的文件会显示在主页列表中
   - 点击文件名可下载或查看文件

3. **管理文件**:
   - 访问 `/manage` 路径可进入文件管理页面
   - 管理页面可删除不需要的文件

## 自定义配置

修改 `config.py` 文件可调整应用设置:

```python
class Config:
    SECRET_KEY = '你的密钥'  # 更改为随机字符串
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    FILES_FOLDER = os.path.join(BASE_DIR, 'files')  # 可更改文件存储位置
```

## 技术栈

- **后端**: Python, Flask
- **前端**: HTML, CSS, JavaScript
- **容器化**: Docker