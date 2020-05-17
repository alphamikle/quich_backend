import { exec } from 'child_process';
import { promisify } from 'util';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Repository } from 'typeorm';
import * as jestMock from 'jest-mock';
import { Logger } from '@nestjs/common';
import { aBaseConfig } from '~/config';
import { EmailService } from '~/email/email.service';
import { EmailContent } from '~/email/entities/email-content.entity';

aBaseConfig();

const asyncExec = promisify(exec);

Logger.log(`NODE ENV IS ${ process.env.NODE_ENV }`);

const mockRepository = new Repository<EmailContent>();
jestMock.spyOn(mockRepository, 'findOne')
  .mockImplementation(async () => undefined);
jestMock.spyOn(mockRepository, 'save')
  .mockImplementation(async () => undefined);
const emailService = new EmailService(mockRepository);

const exceptions = [
  'node_modules',
  '.git',
  '.idea',
  'dist',
];

function getFilePath(fileName: string) {
  const directories: string[] = [];
  const readDir = (path: string): string => {
    directories.push(path);
    while (directories.length) {
      const curDir = directories[0];
      const dirents = readdirSync(curDir, { withFileTypes: true });
      for (const dirent of dirents) {
        if (dirent.isFile() && dirent.name.match(fileName)) {
          return resolve(curDir, dirent.name);
        }
        if (dirent.isDirectory() && !exceptions.includes(dirent.name)) {
          const newPath = resolve(curDir, dirent.name);
          directories.push(newPath);
        }
      }
      directories.splice(0, 1);
    }
    throw new Error(`Not found file ${ fileName } in dir ${ __dirname }`);
  };
  return readDir(__dirname);
}

async function runTest(fileName: string) {
  const path = getFilePath(fileName);
  try {
    Logger.log(`Found test case ${ path }`);
    const result = await asyncExec(`jest --detectOpenHandles ${ path }`);
    console.log(result.stdout);
    console.error(result.stderr);
  } catch (err) {
    await emailService.sendServiceErrorEmailToAdmin(err);
    Logger.error(err.stack);
    process.exit(1);
  }
}

const tests = [
  'fts.service.spec.ts',
  'ofd.service.spec.ts',
];

(async () => {
  for await (const test of tests) {
    await runTest(test);
  }
  Logger.log('All commands complete');
  process.exit(0);
})();
