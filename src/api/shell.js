import shell from 'shelljs';
import { spawn } from 'child_process';
import { currentEditor } from './constants';

export const echo = filePath => shell.echo(filePath);
export const cat = filePath => shell.cat(filePath);
export const cd = path => shell.cd(path);
export const exec = command => shell.exec(command);
export const pathExists = path => shell.test('-e', path);
export const editor = filePath =>
  spawn(currentEditor, [filePath], {
    stdio: 'inherit',
  });
