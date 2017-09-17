import inquirer from 'inquirer';
import moment from 'moment';
import { findEntry, findEntries } from '../api/localdb';
import { editor } from '../api/shell';

export default async () => {
  const entries = await findEntries();
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'entryId',
        message: 'Which entry do you want to edit?',
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
      editor(entry.filePath);
    });
};
