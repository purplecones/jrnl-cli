import fs from 'file-system';
import { filesPath } from './constants';

export const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => (err ? reject(err) : resolve()));
  });
};

export const readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, contents) => (err ? reject(err) : resolve(contents)));
  });
}

export const makeFolder = path => fs.mkdir(path, err => err && console.error(err));


makeFolder(filesPath);
