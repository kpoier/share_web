import { setupDragAndDrop } from "./drag_and_drop.js";
import { setupFileInput } from "./file_input.js";
import { uploadFile } from "./upload.js";
import { loadFileList } from "./file_list.js";

document.addEventListener("DOMContentLoaded", () => {
  function traverseFileTree(item, path = "") {
    if (item.isFile) {
      item.file((file) => uploadFile(file, path));
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
          traverseFileTree(entry, `${path}${item.name}/`);
        });
      });
    }
  }

  setupDragAndDrop(uploadFile, traverseFileTree);
  setupFileInput(uploadFile);
  loadFileList();
});
