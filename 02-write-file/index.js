const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const output = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(output, 'utf-8');

process.on('SIGINT', () => {
  exit();
});
process.on('exit', () => {
  writeStream.end();
  stdout.write(`Goodbye! Your text is in ${output}`);
});
stdout.write('Hello! Please enter text:\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  else writeStream.write(data);
});


