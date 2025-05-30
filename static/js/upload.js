import { loadFileList } from "./file_list.js";

export function createProgressBar(file) {
  // create progress bar container
  const progressContainer = document.createElement("div");
  progressContainer.className = "upload-progress-container";
  progressContainer.style.display = "block";

  // create progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "upload-progress-bar";

  // create progress text
  const progressText = document.createElement("span");
  progressText.textContent = file.name;
  progressText.className = "upload-progress-text";

  // putting progress bar and text into container
  progressContainer.appendChild(progressText);
  progressContainer.appendChild(progressBar);

  // add progress bar to the upload div
  const uploadDiv = document.getElementById("upload");
  uploadDiv.appendChild(progressContainer);

  return {
      container: progressContainer,
      bar: progressBar,
      text: progressText,
      updateProgress: (percent) => {
          progressBar.style.width = `${percent}%`; // resize progress bar
      },
      complete: (success, message) => {
        progressText.textContent = message;
      
        if (success) {
          progressBar.style.backgroundColor = "#4caf50";
          setTimeout(() => {
            progressContainer.remove();
          }, 2000);
        } else {
          progressBar.style.backgroundColor = "#f44336";
          setTimeout(() => {
            progressContainer.remove();
          }, 5000);
        }
      }          
  };
}
  
  export function uploadFile(file, path = "") {
    const formData = new FormData();
    formData.append("uploaded_file", file, file.name);
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
  