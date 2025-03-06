document.addEventListener('DOMContentLoaded', () => {
  function loadFileList() {
    fetch('/api/get_files')
      .then((response) => response.json())
      .then((fileList) => {
        const fileListElement = document.getElementById('file-list');
        fileListElement.innerHTML = ''; // 清空现有列表
        fileList.forEach((file) => {
          const listItem = document.createElement('li');

          // 创建一个文件名链接
          const fileLink = document.createElement('a');
          fileLink.href = `/${file.name}`;
          fileLink.textContent = file.name;
          fileLink.classList.add('file-name');

          // 创建显示文件大小的元素
          const fileSize = document.createElement('span');
          fileSize.classList.add('file-size');
          fileSize.textContent = file.size;

          // 创建删除按钮
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('delete-button');
          deleteButton.addEventListener('click', () => deleteFile(file.name));

          // 将文件信息包含在一起
          const fileInfo = document.createElement('div');
          fileInfo.classList.add('file-info');
          fileInfo.appendChild(fileLink);
          fileInfo.appendChild(fileSize);
          fileInfo.appendChild(deleteButton);

          listItem.appendChild(fileInfo);
          fileListElement.appendChild(listItem);
        });
      })
      .catch((error) => {
        console.error('Error loading file list:', error);
      });
  }

  function deleteFile(fileName) {
    fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: fileName }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Delete success:', data);
        // reload file list
        loadFileList();
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  }

  // 初始加载文件列表
  loadFileList();
});
