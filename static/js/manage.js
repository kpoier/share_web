document.addEventListener('DOMContentLoaded', () => {
  function loadFileList(path = '', parentElement = null) {
    fetch(`/api/get_files?path=${encodeURIComponent(path)}`)
      .then((response) => response.json())
      .then((fileList) => {
        const container = document.createElement('ul');
        container.classList.add('file-list');

        fileList.forEach((file) => {
          const listItem = document.createElement('li');
          const fileInfo = document.createElement('div');
          fileInfo.classList.add('file-info');

          const fullPath = path ? `${path}/${file.name}` : file.name;

          // 名稱
          const nameSpan = document.createElement('span');
          nameSpan.textContent = file.name;
          nameSpan.classList.add(file.type === 'folder' ? 'folder' : 'file');

          // 大小
          const sizeSpan = document.createElement('span');
          sizeSpan.classList.add('file-size');
          sizeSpan.textContent = file.size || '';

          // 刪除按鈕
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.classList.add('delete-button');
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFile(fullPath);
          });

          fileInfo.appendChild(nameSpan);
          fileInfo.appendChild(sizeSpan);
          fileInfo.appendChild(deleteBtn);
          listItem.appendChild(fileInfo);
          container.appendChild(listItem);

          // 如果是資料夾，就遞迴載入裡面的內容
          if (file.type === 'folder') {
            loadFileList(fullPath, listItem);
          }
        });

        if (parentElement) {
          parentElement.appendChild(container);
        } else {
          const root = document.getElementById('file-list');
          root.innerHTML = '';
          root.appendChild(container);
        }
      })
      .catch((error) => {
        console.error('Error loading file list:', error);
      });
  }

  function deleteFile(filePath) {
    fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: filePath }),
    })
      .then((res) => res.json())
      .then(() => {
        document.getElementById('file-list').innerHTML = '';
        loadFileList();
      })
      .catch((err) => console.error('Error deleting file:', err));
  }

  loadFileList(); // 啟動時直接載入所有資料夾
});
