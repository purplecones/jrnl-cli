import inquirer from 'inquirer';
import { writeFile } from '../api/files';
import { findEntry, findEntries } from '../api/localdb';
import { cat, echo } from '../api/shell';
import moment from 'moment';

const showEntriesPrompt = async (max = 20, skip = 0) => {
  const entries = await findEntries(max, skip);
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'answer',
        message: 'Which entry do you want to read?',
        choices: [
          ...entries.map(entry => ({
            value: entry._id,
            name: `${moment(entry.date).format(
              'YYYY-MM-DD HH:mm',
            )} | ${entry.title}`,
          })),
          new inquirer.Separator(),
          'load more',
          new inquirer.Separator(),
        ],
      },
    ])
    .then(async d => handleAnswer(d.answer));
};

const handleAnswer = async answer => {
  if (answer === 'load more') {
    showEntriesPrompt(max, max + skip);
  } else {
    const entry = await findEntry(answer);
    const text = cat(entry.filePath);
    echo(text);
  }
};

export default showEntriesPrompt;
