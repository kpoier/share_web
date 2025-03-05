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

def is_previewable(file_type: str) -> bool:
    """判断是否可以预览"""
    previewable_types = ['txt', 'md', 'py', 'json', 'html', 'css', 'js']
    return file_type in previewable_types

def get_file_info(files_folder: Path) -> list:
    """获取文件类型"""
    lists = []
    folder = Path(files_folder)
    for file_path in folder.iterdir():
        file_type = file_path.suffix.lstrip('.')
        lists.append({
            'name': file_path.name, 
            'size': transform_datasize(file_path.stat().st_size),
            'type': file_type,
            'previewable': is_previewable(file_type)
        })
    return lists

def delete_file_func(files_folder: Path, name: str) -> bool:
    """删除文件"""
    file_path = Path(files_folder) / name
    if file_path.exists():
        file_path.unlink()
        return True
    return False