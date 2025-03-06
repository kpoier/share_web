# 文件分享网站

一个简洁高效的文件分享Web应用，支持拖放上传、文件管理和快速分享。

## 功能特点

- ✨ 拖放式文件上传
- 📊 实时上传进度显示
- 📱 响应式设计，适配各种设备
- 🗂️ 文件管理界面
- 🔗 简单的文件分享链接
- 🐳 Docker支持，便于部署

## 技术栈

- **后端**: Python 3.11, Flask 2.0.1
- **前端**: HTML5, CSS3, JavaScript
- **容器化**: Docker

## 安装与运行

### 方法一: 使用 Docker (推荐)

1. 确保已安装 [Docker](https://www.docker.com/) 和 Docker Compose

2. 克隆仓库
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. 启动应用
   ```bash
   docker-compose up -d
   ```

4. 访问 `http://localhost:8050` 开始使用

### 方法二: 本地运行

1. 确保已安装 Python 3.11

2. 克隆仓库
   ```bash
   git clone https://github.com/kpoier/share_web
   cd share_website
   ```

3. 安装依赖
   ```bash
   pip install Flask
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
│   ├── __init__.py         # Flask应用初始化
│   ├── function.py         # 通用功能函数
│   ├── routes.py           # 路由定义
│   └── templates/          # 页面模板
├── static/
│   ├── css/                # 样式文件
│   ├── js/                 # JavaScript文件
│   └── img/                # 图像资源
├── files/                  # 上传文件存储目录
├── config.py               # 应用配置
├── docker-compose.yaml     # Docker Compose配置
├── dockerfile              # Docker构建文件
├── requirements.txt        # 依赖列表
└── run.py                  # 应用入口点
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
