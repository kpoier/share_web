export function loadFileList() {
  const currentPath = window.location.pathname.replace(/^\/+/, "");

  fetch(`/api/get_files?path=${encodeURIComponent(currentPath)}`)
    .then((response) => response.json())
    .then((files) => {
      const fileListElement = document.getElementById("file-list");
      fileListElement.innerHTML = "";

      if (currentPath) {
        const parentPath = currentPath.split('/').slice(0, -1).join('/');
        const decodedPath = decodeURIComponent(currentPath);
        const pathParts = decodedPath.split('/');
        const rawParts = currentPath.split('/');
      
        // add breadcrumb
        const listItem = document.createElement("li");
        const breadcrumbContainer = document.createElement("div");
        breadcrumbContainer.classList.add("file-info");
        breadcrumbContainer.id = "breadcrumb";
      
        // File Sharing
        const rootLink = document.createElement("a");
        rootLink.href = "/";
        rootLink.textContent = "🏠 File Sharing";
        breadcrumbContainer.appendChild(rootLink);
      
        // every other part of the path
        let cumulativePath = "";
        for (let i = 0; i < rawParts.length; i++) {
          cumulativePath += "/" + rawParts[i];
      
          const separator = document.createTextNode(" / ");
          breadcrumbContainer.appendChild(separator);
      
          const partLink = document.createElement("a");
          partLink.href = cumulativePath;
          partLink.textContent = decodeURIComponent(rawParts[i]);
          breadcrumbContainer.appendChild(partLink);
        }
      
        // add .. link
        const backSeparator = document.createTextNode(" / ");
        breadcrumbContainer.appendChild(backSeparator);
      
        const backLink = document.createElement("a");
        backLink.href = `/${parentPath}`;
        backLink.textContent = "..";
        backLink.id = "backLink";
        breadcrumbContainer.appendChild(backLink);
      
        // add the breadcrumb to the list item
        listItem.appendChild(breadcrumbContainer);
        fileListElement.appendChild(listItem);
      }
      
      

      files.forEach((file) => {
        const listItem = document.createElement("li");

        const fileLink = document.createElement("a");
        let fullPath = currentPath ? `${currentPath}/${file.name}` : file.name;
        fileLink.href = `/${fullPath}`;
        fileLink.textContent = (file.type === "folder" ? "📁 " : "📄 ") + file.name;

        // differentiate between folder and file
        if (file.type === "folder") {
          fileLink.classList.add("folder");
        } else {
          fileLink.classList.add("file");
        }

        // add file size
        const fileSize = document.createElement("span");
        fileSize.classList.add("size");
        fileSize.textContent = file.size;

        // add copy button
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.classList.add("sub-button");
        copyButton.addEventListener("click", (event) => {
          event.preventDefault();
          const fullUrl = encodeURI(`${window.location.origin}/${fullPath}`);
          navigator.clipboard.writeText(fullUrl)
            .then(() => showCopyMessage("Copied to clipboard!"))
            .catch((err) => console.error("Failed to copy: ", err));
        });

        const fileInfo = document.createElement("div");
        fileInfo.classList.add("file-info");
        fileInfo.appendChild(fileLink);
        fileInfo.appendChild(fileSize);
        fileInfo.appendChild(copyButton);

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