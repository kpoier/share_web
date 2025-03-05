from pathlib import Path

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

def is_image(filename: str) -> bool:
    """判断文件是否为图片"""
    ext = Path(filename).suffix.lower().lstrip('.')
    return ext in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']

def delete_file_func(files_folder: str, name: str) -> bool:
    """删除文件"""
    file_path = Path(files_folder) / name
    if file_path.exists():
        file_path.unlink()
        return True
    return False