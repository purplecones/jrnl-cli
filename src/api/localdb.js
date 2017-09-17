import Datastore from 'nedb';
import { dbPath } from './constants';
import { makeFolder } from './files';

// create folders if they dont exist
makeFolder(dbPath);

// prepate local db connection
const journals = new Datastore({ filename: `${dbPath}/journals.db` });

export const addEntry = entry => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.insert(
      entry,
      (err, newDoc) => (err ? reject(err) : resolve(newDoc)),
    );
  });
};

export const findEntries = (max = 5) => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals
      .find({})
      .sort({ date: 0 })
      .exec((err, docs) => (err ? reject(err) : resolve(docs)));
  });
};

export const findEntry = entryId => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.findOne(
      { _id: entryId },
      (err, docs) => (err ? reject(err) : resolve(docs)),
    );
  });
};
