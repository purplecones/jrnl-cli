import inquirer from 'inquirer';
import { writeFile } from '../api/files';
import { findEntry, findEntries } from '../api/localdb';
import { spawn } from 'child_process';
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
              'YYYY-MM-DD HH:MM',
            )} | ${entry.title}`,
          })),
        ],
      },
    ])
    .then(async d => {
      const entry = await findEntry(d.entryId);
      const child = spawn('less', [entry.filePath], {
        stdio: 'inherit',
      });
    });
}
