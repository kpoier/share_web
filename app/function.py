def transform_datasize(size: int) -> str:
    """字节转换"""
    if size < 1024:
        return f'{size} B'
    elif size < 1024**2:
        return f'{size/1024:.2f} KB'
    elif size < 1024**3:
        return f'{size/1024**2:.2f} MB'
    else:
        return f'{size/1024**3:.2f} GB'

def get_file_info(path):
    """获取目录中的文件信息"""
    files = []
    for file_path in path.iterdir():
        item = {'name': str(file_path.relative_to(path))}
        if file_path.is_file():
            item['size'] = transform_datasize(file_path.stat().st_size)
            item['type'] = 'file'
        elif file_path.is_dir():
            item['size'] = ''
            item['type'] = 'folder'
        files.append(item)
    return files