import inquirer from 'inquirer';
import moment from 'moment';
import { findEntry, findEntries, getConfig } from '../api/localdb';
import { editor } from '../api/shell';
import { init, commit, push } from '../api/git';

const showEntriesPrompt = async (max = 20, skip = 0) => {
  const entries = await findEntries(max, skip);
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'answer',
        message: 'Which entry do you want to edit?',
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
    showEntries(max, max + skip);
  } else {
    const entry = await findEntry(answer);
    const childProcess = editor(entry.filePath);
    childProcess.on('exit', async () => {
      // commit and push using git if enabled
      const config = await getConfig();
      if (config && config.useGit) {
        await commit();
        await push();
      }
    });
  }
}

export default showEntriesPrompt;
