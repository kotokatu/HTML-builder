const fs = require('fs');
const os = require('os');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const eol = os.EOL;

async function createDir(path) {
  try {
    await fs.promises.mkdir(path, { recursive: false });
  } catch (err) {
    if (err.code === 'EEXIST') {
      await fs.promises.rm(path, { recursive: true, force: true });
      await fs.promises.mkdir(path);
    } else {
      console.error('The directory could not be created');
    }
  }
}

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
  const cssPath = path.join(projectPath, 'style.css');
  for (let i = 0; i < arr.length; i++) {
    await fs.promises.appendFile(cssPath, `${arr[i]}${eol}`, 'utf-8');
  }
}

async function copyFolder(sourceDir, destDir) {
  await createDir(destDir);
  const sourceContent = await fs.promises.readdir(sourceDir, { withFileTypes: true });
  for (let i = 0; i < sourceContent.length; i++) {
    const source = path.join(sourceDir, sourceContent[i].name);
    const dest = path.join(destDir, sourceContent[i].name);
    if (sourceContent[i].isFile()) {
      await fs.promises.copyFile(source, dest);
    } else {
      copyFolder(source, dest);
    }
  }
}

async function createHtml() {
  const htmlPath = path.join(__dirname, 'project-dist', 'index.html');
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf8' });
  const components = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  for (let i = 0; i < components.length; i++) {
    const file = components[i];
    const filePath = path.join(__dirname, 'components', file.name);
    if (file.isFile() && path.extname(filePath) === '.html' && template.includes(`{{${file.name.match(/(.*)\./)[1]}}}`)) {
      const fileContent = await fs.promises.readFile(filePath, { encoding: 'utf8' });
      template = template.replace(`{{${file.name.match(/(.*)\./)[1]}}}`, fileContent);
    }
  }
  await fs.promises.writeFile(htmlPath, template, 'utf-8');
}

async function init() {
  await createDir(projectPath);
  await copyFolder(path.join(__dirname, 'assets'), path.join(projectPath, 'assets'));
  await mergeStyles();
  await createHtml();
}

init();

