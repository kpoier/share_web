export function setupFileInput(uploadFile) {
    const fileInput   = document.getElementById("fileInput");
    const folderInput = document.getElementById("folderInput");
    const uploadFilesButton   = document.getElementById("uploadFilesButton");
    const uploadFoldersButton = document.getElementById("uploadFoldersButton");
  
    uploadFilesButton.addEventListener("click", () => fileInput.click());
    uploadFoldersButton.addEventListener("click", () => folderInput.click());
  
    // multiple file input
    fileInput.addEventListener("change", e => {
      const basePath = getCurrentPath();
      Array.from(e.target.files)
           .forEach(file => uploadFile(file, basePath));
    });
  
    // upload folder
    folderInput.addEventListener("change", e => {
      const basePath = getCurrentPath();
      Array.from(e.target.files).forEach(file => {
        // process webkitRelativePath
        let relativePath = file.webkitRelativePath || "";
        if (relativePath) {
          const segs = relativePath.split("/");
          if (segs[0] === "0") segs.shift();
          segs.pop();
          relativePath = segs.length ? segs.join("/") + "/" : "";
        }
        uploadFile(file, basePath + relativePath);
      });
    });
  
    function getCurrentPath() {
      let p = window.location.pathname;
      if (p === "/" || p === "") return "";
      p = p.replace(/^\//, "");
      if (!p.endsWith("/")) p += "/";
      return p;
    }
  }
  