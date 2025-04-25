export function loadFileList() {
  const currentPath = window.location.pathname.replace(/^\/+/, "");

  fetch(`/api/get_files?path=${encodeURIComponent(currentPath)}`)
    .then((response) => response.json())
    .then((files) => {
      const fileListElement = document.getElementById("file-list");
      fileListElement.innerHTML = "";

      if (currentPath) {
        const parentPath = currentPath
          .split('/')
          .slice(0, -1)
          .join('/');

        // 创建与文件列表项一致的结构
        const listItem = document.createElement("li");

        const backLink = document.createElement("a");
        backLink.href = `/${parentPath}`;
        backLink.textContent = "..";
        backLink.classList.add("file-info");

        const fileInfo = document.createElement("div");
        fileInfo.classList.add("file-info");
        fileInfo.appendChild(backLink);

        listItem.appendChild(fileInfo);
        fileListElement.appendChild(listItem);
      }

      files.forEach((file) => {
        const listItem = document.createElement("li");

        const fileLink = document.createElement("a");
        let fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
        fileLink.href = `/${fullPath}`;
        fileLink.textContent = file.name;

        // differentiate between folder and file
        if (file.type === "folder") {
          fileLink.classList.add("folder");
        } else {
          fileLink.classList.add("file");
        }

        const fileSize = document.createElement("span");
        fileSize.classList.add("size");
        fileSize.textContent = file.size;

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

function showCopyMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.classList.add("flash");
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 2000);
}