import { Dirent, readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Logger } from '@nestjs/common';

const start = Date.now();

const files: string[] = [];
const optionalFieldRegExp = /: ([a-zA-Z]*) \| undefined;/;
const controllerMethodRegExp = / ([A-Z])(.*\()/;
const secondParamRegExp = /[a-z](\([a-zA-Z]*: [a-zA-Z]*\))/;
const maxTries = 1000;
let tries = 0;

function searchFiles(dir: string) {
  const dirFiles: Dirent[] = readdirSync(dir, { withFileTypes: true });
  for (const file of dirFiles) {
    if (file.isDirectory()) {
      searchFiles(resolve(dir, file.name));
    } else {
      files.push(resolve(dir, file.name));
    }
  }
}

function handleFiles() {
  for (const file of files) {
    let fileData = readFileSync(file).toString();

    while (fileData.match(optionalFieldRegExp) && tries < maxTries) {
      fileData = fileData.replace(optionalFieldRegExp, '?: $1;');
      tries += 1;
    }

    while (fileData.match(controllerMethodRegExp) && tries < maxTries) {
      const matches = fileData.match(controllerMethodRegExp);
      fileData = fileData.replace(matches[0], ` ${ matches[1].toLowerCase() }${ matches[2] }`);
      tries += 1;
    }

    while (fileData.match(secondParamRegExp) && tries < maxTries) {
      const matches = fileData.match(secondParamRegExp);
      fileData = fileData.replace(matches[1], `${ matches[1].replace(')', '') }, meta: Metadata)`);
      tries += 1;
    }

    fileData = `import { Metadata } from 'grpc';\n${ fileData }`;
    writeFileSync(file, fileData);
  }
}

searchFiles(resolve(__dirname, 'src', 'proto-generated'));

handleFiles();
Logger.log(`Handling ended with ${ tries } items in ${ (Date.now() - start) }ms`);
process.exit(0);