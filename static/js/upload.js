import { loadFileList } from "./file_list.js";

export function createProgressBar(file) {
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
  
  export function uploadFile(file, path = "") {
    const formData = new FormData();
    formData.append("uploaded_file", file);
    formData.append("path", path);
  
    const progress = createProgressBar(file);
    const xhr = new XMLHttpRequest();
  
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progress.updateProgress(percent);
      }
    });
  
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        progress.complete(true, `${file.name} Uploaded Successfully!`);
        loadFileList();
      } else {
        progress.complete(false, `Upload failed: ${xhr.statusText}`);
      }
    });
  
    xhr.addEventListener("error", () => {
      progress.complete(false, "Upload error: Network error");
    });
  
    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  }
  