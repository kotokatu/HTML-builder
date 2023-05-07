const fs = require('fs');
const path = require('path');

const copyFolder = async () => {
  const origDirPath = path.join(__dirname, 'files');
  const newDirPath = path.join(__dirname, 'files-copy');
  const origDirContent = await fs.promises.readdir(origDirPath);
  try {
    await fs.promises.mkdir(newDirPath, { recursive: false });
  } catch (err) {
    if (err.code === 'EEXIST') {
      await fs.promises.rm(newDirPath, { recursive: true, force: true });
      await fs.promises.mkdir(newDirPath);
    } else {
      console.error('The directory could not be created');
    }
  }
  for (let i = 0; i < origDirContent.length; i++) {
    const origFilePath = path.join(origDirPath, origDirContent[i]);
    const newFilePath = path.join(newDirPath, origDirContent[i]);
    try {
      await fs.promises.copyFile(origFilePath, newFilePath);
    } catch {
      console.error('The file could not be copied');
    }
  }
};

copyFolder();
