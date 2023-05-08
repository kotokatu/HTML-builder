const fs = require('fs');
const path = require('path');
const readline = require('readline');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const rl = readline.createInterface({ input: process.stdin });
const os = require('os');
const eol = os.EOL;

function exit() {
  process.stdout.write(`Goodbye! Your text is in ${path.join(__dirname, 'text.txt')}`);
  rl.close();
  process.exit();
}

process.on('SIGINT', () => {
  exit();
});

rl.on('line', data => {
  if (data === 'exit') exit();
  else output.write(data + eol);
});

process.stdout.write(`Hello! Please enter text:${eol}`);


