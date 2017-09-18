import inquirer from 'inquirer';
import moment from 'moment';
import { findEntry, findEntries, getConfig, editEntry } from '../api/db';
import { editor } from '../api/shell';
import { init, commit, push } from '../api/git';
import { readFile } from '../api/files';
import { getSentimentScore } from '../api/sentiment';
import { generateReadme } from '../api/common';

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
      const text = await readFile(entry.filePath);
      const sentiment = getSentimentScore(text.replace(/[^\x20-\x7E]/gim, ''));
      await editEntry(entry._id, { sentiment });

      await generateReadme();
      
      // commit and push using git if enabled
      const config = await getConfig();
      if (config && config.useGit) {
        await commit();
        await push();
      }
    });
  }
};

export default showEntriesPrompt;
