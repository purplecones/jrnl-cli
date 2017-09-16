import Datastore from 'nedb';
import os from 'os';
import fs from 'file-system';

// identify users preferred editor
const editor = process.env.EDITOR || 'vi';

// create jrnl folder in users home directory
const path = `${os.homedir()}/.jrnl/data`;
fs.mkdir(path, err => console.error(err));

// prepate local db connection
const journals = new Datastore({ filename: `${path}/journals.db` });

export const addEntry = text => {
  journals.loadDatabase();
  journals.insert({
    date: new Date(),
    text,
  });
};
