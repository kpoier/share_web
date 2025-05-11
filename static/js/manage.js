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

          // name
          const nameSpan = document.createElement('span');
          nameSpan.textContent = file.name;
          nameSpan.classList.add(file.type === 'folder' ? 'folder' : 'file');

          // size
          const sizeSpan = document.createElement('span');
          sizeSpan.classList.add('file-size');
          sizeSpan.textContent = file.size || '';

          // delete button
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

          // folder
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

  loadFileList();
});
