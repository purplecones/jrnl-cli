import Datastore from 'nedb';
import { dbPath } from './constants';
import { makeFolder } from './files';

// create folders if they dont exist
makeFolder(dbPath);

// prepate local db connection
const journals = new Datastore({ filename: `${dbPath}/journals.db` });
const config = new Datastore({ filename: `${dbPath}/config.db` });

export const addEntry = entry => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.insert(
      entry,
      (err, newDoc) => (err ? reject(err) : resolve(newDoc)),
    );
  });
};

export const editEntry = (id, data) => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.update(
      { _id: id },
      {
        $set: data,
      },
      (err, updatedDoc) => (err ? reject(err) : resolve(updatedDoc)),
    );
  });
};

export const findEntries = (max, skip) => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals
      .find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(max)
      .exec((err, docs) => (err ? reject(err) : resolve(docs)));
  });
};

export const findEntry = entryId => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.findOne(
      { _id: entryId },
      (err, doc) => (err ? reject(err) : resolve(doc)),
    );
  });
};

export const findEntryByTitle = title => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.findOne(
      { title },
      (err, doc) => (err ? reject(err) : resolve(doc)),
    );
  });
};

export const findEntriesByFileName = fileNames => {
  journals.loadDatabase();
  return new Promise((resolve, reject) => {
    journals.find(
      { fileName: { $in: fileNames } },
      (err, doc) => (err ? reject(err) : resolve(doc)),
    );
  });
};

export const getConfig = () => {
  config.loadDatabase();
  return new Promise((resolve, reject) => {
    config.findOne({}, (err, doc) => (err ? reject(err) : resolve(doc)));
  });
};

export const updateConfig = async newConfig => {
  config.loadDatabase();
  const currentConfig = (await getConfig()) || undefined;
  return new Promise((resolve, reject) => {
    if (currentConfig) {
      // update config
      config.update(
        { _id: currentConfig._id },
        { $set: newConfig },
        (err, doc) => (err ? reject(err) : resolve(doc)),
      );
    } else {
      // insert new config
      config.insert(
        newConfig,
        (err, doc) => (err ? reject(err) : resolve(doc)),
      );
    }
  });
};
