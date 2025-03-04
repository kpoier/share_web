from app import create_app

# 创建Flask应用实例
app = create_app()

# 当直接运行此脚本时，启动服务
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
