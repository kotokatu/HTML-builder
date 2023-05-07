const fs = require('fs');
const path = require('path');
const os = require('os');
const eol = os.EOL;

async function mergeStyles() {
  const stylesContent = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  const arr = [];
  for (let i = 0; i < stylesContent.length; i++) {
    const file = stylesContent[i];
    const filePath = path.join(__dirname, 'styles', file.name);
    if (file.isFile() && path.extname(filePath) === '.css') {
      const contents = await fs.promises.readFile(filePath, { encoding: 'utf8' });
      arr.push(contents);
    }
  }
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  await fs.promises.rm(bundlePath, { recursive: true, force: true });
  for (let i = 0; i < arr.length; i++) {
    await fs.promises.appendFile(bundlePath, `${arr[i]}${eol}`, 'utf-8');
  }
}

mergeStyles();