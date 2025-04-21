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
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const backLink = document.createElement("a");
        backLink.href = `/${parentPath}`;
        backLink.textContent = "..";
        backLink.classList.add("text-secondary", "fw-bold"); // 样式与文件夹类似

        const fileInfo = document.createElement("div");
        fileInfo.classList.add("file-info");
        fileInfo.appendChild(backLink);

        listItem.appendChild(fileInfo);
        fileListElement.appendChild(listItem);
      }

      files.forEach((file) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const fileLink = document.createElement("a");
        let fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
        fileLink.href = `/${fullPath}`;
        fileLink.textContent = file.name;

        // 根据文件类型添加不同的样式
        if (file.type === "folder") {
          fileLink.classList.add("text-warning", "fw-bold"); // 文件夹样式
        } else {
          fileLink.classList.add("text-primary", "fw-bold"); // 文件样式
        }

        const fileSize = document.createElement("span");
        fileSize.classList.add("badge", "bg-secondary", "ms-2");
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
  messageDiv.classList.add("alert", "alert-success", "position-fixed", "top-0", "start-50", "translate-middle-x", "mt-3");
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 2000);
}