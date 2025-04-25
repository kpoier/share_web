import { loadFileList } from "./file_list.js";

export function createProgressBar(file) {
  // 创建进度条容器
  const progressContainer = document.createElement("div");
  progressContainer.className = "upload-progress-container";
  progressContainer.style.display = "block";

  // 创建进度条
  const progressBar = document.createElement("div");
  progressBar.className = "upload-progress-bar";

  // 创建文件名（放到进度条容器中）
  const progressText = document.createElement("span");
  progressText.textContent = file.name; // 显示文件名
  progressText.className = "upload-progress-text";

  // 将文件名和进度条添加到容器
  progressContainer.appendChild(progressText);
  progressContainer.appendChild(progressBar);

  // 添加到上传区域
  const uploadDiv = document.getElementById("upload");
  uploadDiv.appendChild(progressContainer);

  return {
      container: progressContainer,
      bar: progressBar,
      text: progressText,
      updateProgress: (percent) => {
          progressBar.style.width = `${percent}%`; // 更新进度条宽度
      },
      complete: (success, message) => {
          if (success) {
              progressBar.style.backgroundColor = "#4caf50"; // 成功时绿色
          } else {
              progressBar.style.backgroundColor = "#f44336"; // 失败时红色
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
  