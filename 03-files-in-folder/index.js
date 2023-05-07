const fs = require('fs');
const path = require('path');
async function getDirFiles (folder) {
  let dirContent = await fs.promises.readdir(folder, {withFileTypes: true});
  dirContent = dirContent.filter(obj => obj.isFile());
  for (let i = 0; i < dirContent.length; i++) {
    const filePath = path.join(__dirname, 'secret-folder', dirContent[i].name);
    const stat = await fs.promises.stat(filePath);
    const size = stat.size + ' bytes';
    const ext = path.extname(filePath).slice(1);
    const fileName = dirContent[i].name.match(/(.*)\./);
    console.log(`${fileName[1]} - ${ext} - ${size}`);
  }
}
getDirFiles(path.join(__dirname, 'secret-folder'));

