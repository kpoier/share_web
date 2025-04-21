export function setupDragAndDrop(uploadFile) {
  const events = {
    preventDefault: ["dragenter", "dragover", "dragleave", "drop"],
    highlight: ["dragenter", "dragover"],
    unhighlight: ["dragleave", "drop"],
  };

  events.preventDefault.forEach(eventName => {
    document.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  events.highlight.forEach(eventName => {
    document.addEventListener(eventName, () => {
      document.body.classList.add("highlight");
    });
  });

  events.unhighlight.forEach(eventName => {
    document.addEventListener(eventName, () => {
      document.body.classList.remove("highlight");
    });
  });

  document.addEventListener("drop", (e) => {
    const basePath = getCurrentPath();
    const items = [...e.dataTransfer.items];

    items.forEach((item) => {
      const entry = item.webkitGetAsEntry?.();
      if (entry) {
        traverseFileTree(entry, basePath);
      }
    });
  });

  function getCurrentPath() {
    let p = window.location.pathname;
    if (p === "/" || p === "") return "";
    p = p.replace(/^\//, "");
    if (!p.endsWith("/")) p += "/";
    return p;
  }

  // traverseFileTree 會遞迴抓出所有檔案（保留相對路徑）
  function traverseFileTree(item, path = "") {
    if (item.isFile) {
      item.file((file) => {
        const relativePath = path + file.name;
        uploadFile(file, relativePath);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseFileTree(entry, path + item.name + "/");
        });
      });
    }
  }
}
