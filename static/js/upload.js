import { loadFileList } from "./file_list.js";

export function createProgressBar(file) {
    // create progress container
    const progressContainer = document.createElement("div");
    progressContainer.className = "upload-progress-container";
    progressContainer.style.display = "block";

    // create file name display
    const fileNameDiv = document.createElement("div");
    fileNameDiv.textContent = `Uploading: ${file.name}`;
    fileNameDiv.style.marginBottom = "5px";

    // create progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "upload-progress-bar";

    // create progress text
    const progressText = document.createElement("span");
    progressText.textContent = "0%";
    progressBar.appendChild(progressText);
    progressContainer.appendChild(progressBar);

    // create status message
    const statusDiv = document.createElement("div");
    statusDiv.className = "upload-status";

    // add elements to the container
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
          // after 2 seconds, remove the status message
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
  