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
export const editor = (filePath, readOnly = false) => {
  let readOnlyShellFlag;
  let command;
  if (readOnly) {
    if (currentEditor === 'vim') {
      readOnlyShellFlag = '-r';
    }
    command = 'less';
  } else {
    command = currentEditor;
  }
  const options = [filePath];
  {/* if (readOnly) options.push(readOnlyShellFlag); */}
  return spawn(command, options, {
    stdio: 'inherit',
  });
};
