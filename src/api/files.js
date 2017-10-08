import fs from 'file-system';
import findInFiles from 'find-in-files';
import { filesPath } from './constants';

export const searchFile = reg => findInFiles.find(reg, filesPath, /\.md$/);

export const writeFile = (filePath, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => (err ? reject(err) : resolve()));
  });

export const readFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(
      filePath,
      'utf-8',
      (err, contents) => (err ? reject(err) : resolve(contents)),
    );
  });

export const makeFolder = path =>
  fs.mkdir(path, err => err && console.error(err));

export const fuzzySearch = async regExpString => {
  const filesObject = await searchFile(new RegExp(regExpString));
  const fileNames = [];
  // TODO find a better way to do this
  // eslint-disable-next-line
  for (const prop in filesObject) {
    // eslint-disable-next-line
    if (filesObject.hasOwnProperty(prop)) {
      const fileParts = prop.split('/');
      fileNames.push(fileParts[fileParts.length - 1]);
    }
  }
  return fileNames;
};

makeFolder(filesPath);
