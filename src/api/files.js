import fs from 'file-system';
import { filesPath } from './constants';

export const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => (err ? reject(err) : resolve()));
  });
};

export const makeFolder = path => fs.mkdir(path, err => err && console.error(err));

makeFolder(filesPath);
