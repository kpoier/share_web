document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropzone');

    // 防止默认行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖放样式
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    // 处理文件拖放
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file) {
        const url = 'api/upload';
        const formData = new FormData();
        formData.append('file', file);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // 重新加载文件列表
            loadFileList();
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }

    function loadFileList() {
        fetch('/api/get_files')
            .then(response => response.json())
            .then(fileList => {
                const fileListElement = document.getElementById('file-list');
                fileListElement.innerHTML = ''; // 清空现有列表
                fileList.forEach(file => {
                    const listItem = document.createElement('li');

                    // 创建一个文件名链接
                    const fileLink = document.createElement('a');
                    fileLink.href = `/share/${file.name}`;
                    fileLink.textContent = file.name;
                    fileLink.classList.add('file-name');

                    // 创建显示文件大小的元素
                    const fileSize = document.createElement('span');
                    fileSize.classList.add('file-size');
                    fileSize.textContent = `${file.size}`;

                    // 将文件信息包含在一起
                    const fileInfo = document.createElement('div');
                    fileInfo.classList.add('file-info');
                    fileInfo.appendChild(fileLink);
                    fileInfo.appendChild(fileSize);

                    listItem.appendChild(fileInfo);
                    fileListElement.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error loading file list:', error);
            });
    }

    // 初始加载文件列表
    loadFileList();
});
