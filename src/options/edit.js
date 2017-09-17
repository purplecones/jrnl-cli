import inquirer from 'inquirer';
import moment from 'moment';
import { findEntry, findEntries } from '../api/localdb';
import { editor } from '../api/shell';
import { init, commit, push } from '../api/git';

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
      const childProcess = editor(entry.filePath);
      childProcess.on('exit', () => {
        init();
        commit();
        push();
      })
    });
};
