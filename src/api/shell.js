import shell from 'shelljs';
import { spawn } from 'child_process';
import { currentEditor } from './constants';

export const echo = filePath => shell.echo(filePath);
export const cat = filePath => shell.cat(filePath);
export const cd = path => shell.cd(path);
export const which = name => shell.which(name);
export const exec = command =>
  new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (code === 0) resolve({ code, stdout, stderr });
      reject({ code, stdout, stderr });
    });
  });
export const pathExists = path => shell.test('-e', path);
export const editor = filePath =>
  spawn(currentEditor, [filePath], {
    stdio: 'inherit',
  });
