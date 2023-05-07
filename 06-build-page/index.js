const fs = require('fs');
const os = require('os');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const eol = os.EOL;

async function createDir(path) {
  try {
    await fs.promises.mkdir(path, { recursive: false });
  } catch(err) {
    console.error(err);
  }
}

async function removeDir(path) {
  try {
    await fs.promises.rm(path, { recursive: true, force: true });
  } catch (err) {
    console.error(err);
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
  await fs.promises.rm(cssPath, { recursive: true, force: true });
  for (let i = 0; i < arr.length; i++) {
    await fs.promises.appendFile(cssPath, `${arr[i]}${eol}`, 'utf-8');
  }
}

async function copyFolder(origDirPath, newDirPath) {
  createDir(newDirPath);
  const origContent = await fs.promises.readdir(origDirPath, { withFileTypes: true });
  for (let i = 0; i < origContent.length; i++) {
    const origPath = path.join(origDirPath, origContent[i].name);
    const newPath = path.join(newDirPath, origContent[i].name);
    try {
      if (origContent[i].isFile()) {
        await fs.promises.copyFile(origPath, newPath);
      }
      if (origContent[i].isDirectory()) {
        copyFolder(origPath, newPath);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

async function createHtml() {
  const htmlPath = path.join(__dirname, 'project-dist', 'index.html');
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf8' });
  const componentsDir = await fs.promises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  for (let i = 0; i < componentsDir.length; i++) {
    const file = componentsDir[i];
    const filePath = path.join(__dirname, 'components', file.name);
    if (file.isFile() && path.extname(filePath) === '.html' && template.includes(file.name.match(/(.*)\./)[1])) {
      const fileContent = await fs.promises.readFile(filePath, { encoding: 'utf8' });
      template = template.replace(`{{${file.name.match(/(.*)\./)[1]}}}`, fileContent);
    }
  }
  fs.promises.appendFile(htmlPath, template, 'utf-8');
}

async function init() {
  await removeDir(projectPath);
  await createDir(projectPath);
  await copyFolder(path.join(__dirname, 'assets'), path.join(projectPath, 'assets'));
  await mergeStyles();
  await createHtml();
}

init();

