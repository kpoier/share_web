from app import create_app

# 创建Flask应用实例
app = create_app()

# 当直接运行此脚本时，启动服务
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)