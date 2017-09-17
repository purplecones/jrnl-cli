import inquirer from 'inquirer';
import { writeFile } from '../api/files';
import { findEntry, findEntries } from '../api/localdb';
import { cat, echo } from '../api/shell';
import moment from 'moment';

export default async () => {
  const entries = await findEntries();
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'entryId',
        message: 'Which entry do you want to read?',
        choices: [
          ...entries.map(entry => ({
            value: entry._id,
            name: `${moment(entry.date).format(
              'YYYY-MM-DD HH:mm',
            )} | ${entry.title}`,
          })),
        ],
      },
    ])
    .then(async d => {
      const entry = await findEntry(d.entryId);
      const text = cat(entry.filePath);
      echo(text);
    });
};
