document.addEventListener("DOMContentLoaded", () => {
  const uploadFilesButton = document.getElementById("uploadFilesButton");
  const uploadFoldersButton = document.getElementById("uploadFoldersButton");
  const fileInput = document.getElementById("fileInput");
  const folderInput = document.getElementById("folderInput");

  const events = {
    preventDefault: ["dragenter", "dragover", "dragleave", "drop"],
    highlight: ["dragenter", "dragover"],
    unhighlight: ["dragleave", "drop"],
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
      () => document.body.classList.add("highlight"),
      false
    );
  });

  events.unhighlight.forEach((eventName) => {
    document.addEventListener(
      eventName,
      () => document.body.classList.remove("highlight"),
      false
    );
  });

  // 处理文件拖放
  document.addEventListener(
    "drop",
    (e) => {
      [...e.dataTransfer.items].forEach((item) => {
        const entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          uploadFile(item.getAsFile());
        } else if (entry.isDirectory) {
          traverseFileTree(entry);
        }
      });
    },
    false
  );

  // 文件选择按钮点击事件
  uploadFilesButton.addEventListener("click", () => {
    fileInput.click();
  });

  // 文件夹选择按钮点击事件
  uploadFoldersButton.addEventListener("click", () => {
    folderInput.click();
  });

  // 处理文件选择
  fileInput.addEventListener("change", (e) => {
    [...e.target.files].forEach((file) => {
      uploadFile(file);
    });
  });

  // 处理文件夹选择
  folderInput.addEventListener("change", (e) => {
    [...e.target.files].forEach((file) => {
      let relativePath = file.webkitRelativePath || "";

      // 当有路径信息时，检查并移除多余的 "0/" 前缀
      if (relativePath) {
        // 以 "/" 分割路径
        const segments = relativePath.split("/");
        // 如果第一个段是 "0"，则移除它
        if (segments[0] === "0") {
          segments.shift();
        }
        // 移除最后一个段(文件名)，只保留文件夹路径
        segments.pop();
        // 如果还有文件夹信息，就组合成路径字符串，并在末尾加上 "/"
        relativePath = segments.length ? segments.join("/") + "/" : "";
      }
      uploadFile(file, relativePath);
    });
  });

  // 遍历文件夹
  function traverseFileTree(item, path = "") {
    if (item.isFile) {
      item.file((file) => {
        uploadFile(file, path);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseFileTree(entry, `${path}${item.name}/`);
        });
      });
    }
  }

  // 创建上传进度条
  function createProgressBar(file) {
    // 创建进度条容器
    const progressContainer = document.createElement("div");
    progressContainer.className = "upload-progress-container";
    progressContainer.style.display = "block";

    // 创建文件名显示
    const fileNameDiv = document.createElement("div");
    fileNameDiv.textContent = `正在上传: ${file.name}`;
    fileNameDiv.style.marginBottom = "5px";

    // 创建进度条
    const progressBar = document.createElement("div");
    progressBar.className = "upload-progress-bar";

    // 创建进度百分比显示
    const progressText = document.createElement("span");
    progressText.textContent = "0%";
    progressBar.appendChild(progressText);
    progressContainer.appendChild(progressBar);

    // 创建状态显示区域
    const statusDiv = document.createElement("div");
    statusDiv.className = "upload-status";

    // 将所有元素添加到上传区域
    const uploadDiv = document.getElementById("upload");
    uploadDiv.appendChild(fileNameDiv);
    uploadDiv.appendChild(progressContainer);
    uploadDiv.appendChild(statusDiv);

    return {
      container: progressContainer,
      bar: progressBar,
      status: statusDiv,
      text: progressText,
      updateProgress: (percent) => {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
      },
      complete: (success, message) => {
        progressContainer.style.display = "none";
        statusDiv.style.display = "block";
        statusDiv.textContent = message;
        if (success) {
          statusDiv.className = "upload-status upload-success";
          // 2秒后隐藏成功消息
          setTimeout(() => {
            statusDiv.style.display = "none";
            fileNameDiv.remove();
          }, 2000);
        } else {
          statusDiv.className = "upload-status upload-error";
        }
      },
    };
  }

  // 上传文件
  function uploadFile(file, path = "") {
    const formData = new FormData();
    formData.append("uploaded_file", file);
    formData.append("path", path);

    // 创建进度条
    const progress = createProgressBar(file);

    // 使用 XMLHttpRequest 跟踪上传进度
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progress.updateProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        progress.complete(true, `${file.name} 上传成功!`);
        loadFileList();
      } else {
        progress.complete(false, `上传失败: ${xhr.statusText}`);
      }
    });

    xhr.addEventListener("error", () => {
      progress.complete(false, "上传失败: 网络错误");
    });

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  }

  // 加载文件列表
  function loadFileList() {
    fetch("/api/get_files")
      .then((response) => response.json())
      .then((files) => {
        const fileListElement = document.getElementById("file-list");
        fileListElement.innerHTML = "";

        files.forEach((file) => {
          const listItem = document.createElement("li");

          // 文件链接
          const fileLink = document.createElement("a");
          fileLink.href = `/${file.name}`;
          fileLink.textContent = file.name;
          fileLink.classList.add("file-name");

          // 文件大小
          const fileSize = document.createElement("span");
          fileSize.classList.add("file-size");
          fileSize.textContent = file.size;

          // 包装信息
          const fileInfo = document.createElement("div");
          fileInfo.classList.add("file-info");
          fileInfo.appendChild(fileLink);
          fileInfo.appendChild(fileSize);

          listItem.appendChild(fileInfo);
          fileListElement.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Load file list error:", error));
  }

  // 初始加载文件列表
  loadFileList();
});
