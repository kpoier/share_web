document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');

    // 防止默认行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // 添加拖放样式
    ['dragenter', 'dragover'].forEach(eventName => {
        document.addEventListener(eventName, () => document.body.classList.add('highlight'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, () => document.body.classList.remove('highlight'), false);
    });

    // 处理文件拖放
    document.addEventListener('drop', (e) => {
        let dt = e.dataTransfer;
        let files = dt.files;
        ([...files]).forEach(uploadFile);
    }, false);


    // 处理文件选择按钮点击事件
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    // 处理文件选择事件
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        ([...files]).forEach(uploadFile);
    });

    function uploadFile(file) {
        const url = 'api/upload';
        const formData = new FormData();
        formData.append('uploaded_file', file);

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

                    // 创建文件名链接
                    const fileLink = document.createElement('a');
                    fileLink.href = `/${file.name}`; // 指向统一的文件处理路由
                    fileLink.textContent = file.name;
                    fileLink.classList.add('file-name');

                    // 如果是图片，添加图片标识类
                    if (file.isImage) {
                        fileLink.classList.add('image-file');
                    }

                    // 创建文件大小元素
                    const fileSize = document.createElement('span');
                    fileSize.classList.add('file-size');
                    fileSize.textContent = file.size;

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