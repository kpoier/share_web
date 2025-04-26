export function setupDragAndDrop(uploadFile) {
  let dragCounter = 0; // ✨新增一個 counter

  const events = {
    preventDefault: ["dragenter", "dragover", "dragleave", "drop"],
  };

  events.preventDefault.forEach(eventName => {
    document.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  document.addEventListener("dragenter", (e) => {
    dragCounter++;
    if (dragCounter === 1) {
      document.body.classList.add("highlight"); // ✨第一次進來時加上
    }
  });

  document.addEventListener("dragleave", (e) => {
    dragCounter--;
    if (dragCounter === 0) {
      document.body.classList.remove("highlight"); // ✨全部離開時移除
    }
  });

  document.addEventListener("drop", (e) => {
    dragCounter = 0; // ✨drop時直接清零
    document.body.classList.remove("highlight");

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

  function traverseFileTree(item, path = "") {
    if (item.isFile) {
      item.file((file) => {
        const relativePath = path;
        uploadFile(file, relativePath);
      });
    } else if (item.isDirectory) {
      const newPath = path + item.name + "/";
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseFileTree(entry, newPath);
        });
      });
    }
  }
}
