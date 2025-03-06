document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.getElementById('uploadButton');
  const fileInput = document.getElementById('fileInput');
  const events = {
    preventDefault: ['dragenter', 'dragover', 'dragleave', 'drop'],
    highlight: ['dragenter', 'dragover'],
    unhighlight: ['dragleave', 'drop'],
  };

  // 防止拖放的默认行为
  events.preventDefault.forEach((eventName) => {
    document.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  });

  // 拖放区域高亮
  events.highlight.forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => document.body.classList.add('highlight'),
      false
    );
  });
  events.unhighlight.forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => document.body.classList.remove('highlight'),
      false
    );
  });

  // 处理文件拖放
  document.addEventListener(
    'drop',
    (e) => {
      [...e.dataTransfer.files].forEach(uploadFile);
    },
    false
  );

  // 文件选择按钮
  uploadButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    [...e.target.files].forEach(uploadFile);
  });

  // 上传文件
  function uploadFile(file) {
    const formData = new FormData();
    formData.append('uploaded_file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then(() => loadFileList())
      .catch((error) => console.error('Upload failed:', error));
  }

  // 加载文件列表
  function loadFileList() {
    fetch('/api/get_files')
      .then((response) => response.json())
      .then((files) => {
        const fileListElement = document.getElementById('file-list');
        fileListElement.innerHTML = '';

        files.forEach((file) => {
          const listItem = document.createElement('li');

          // 文件链接
          const fileLink = document.createElement('a');
          fileLink.href = `/${file.name}`;
          fileLink.textContent = file.name;
          fileLink.classList.add('file-name');

          // 文件大小
          const fileSize = document.createElement('span');
          fileSize.classList.add('file-size');
          fileSize.textContent = file.size;

          // 包装信息
          const fileInfo = document.createElement('div');
          fileInfo.classList.add('file-info');
          fileInfo.appendChild(fileLink);
          fileInfo.appendChild(fileSize);

          listItem.appendChild(fileInfo);
          fileListElement.appendChild(listItem);
        });
      })
      .catch((error) => console.error('Load file list error:', error));
  }

  // 初始加载文件列表
  loadFileList();
});
