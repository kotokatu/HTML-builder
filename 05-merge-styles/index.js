const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
  await fs.promises.rm(bundlePath, { recursive: true, force: true });
  const output = fs.createWriteStream(bundlePath, {flags: 'a'});
  const stylesContent = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  for (let i = 0; i < stylesContent.length; i++) {
    const file = stylesContent[i];
    const filePath = path.join(__dirname, 'styles', file.name);
    if (file.isFile() && path.extname(filePath) === '.css') {
      const input = fs.createReadStream(filePath, 'utf-8');
      input.pipe(output);
    }
  }
}

mergeStyles();