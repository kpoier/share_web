export function setupFileInput(uploadFile) {
    const fileInput   = document.getElementById("fileInput");
    const folderInput = document.getElementById("folderInput");
    const uploadFilesButton   = document.getElementById("uploadFilesButton");
    const uploadFoldersButton = document.getElementById("uploadFoldersButton");
  
    uploadFilesButton.addEventListener("click", () => fileInput.click());
    uploadFoldersButton.addEventListener("click", () => folderInput.click());
  
    // 多檔案上傳
    fileInput.addEventListener("change", e => {
      const basePath = getCurrentPath();
      Array.from(e.target.files)
           .forEach(file => uploadFile(file, basePath));
    });
  
    // 資料夾上傳
    folderInput.addEventListener("change", e => {
      const basePath = getCurrentPath();
      Array.from(e.target.files).forEach(file => {
        // 處理相對路徑 (保留子資料夾結構)
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
  