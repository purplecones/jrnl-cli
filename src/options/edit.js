import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import { fuzzySearch, readFile } from '../api/files.js';
import {
  findEntryByTitle,
  getConfig,
  editEntry,
  findEntriesByFileName,
} from '../api/db';
import { editor } from '../api/shell';
import { pull, commit, push } from '../api/git';
import { getSentimentScore } from '../api/sentiment';
import { generateReadme } from '../api/common';

const showEntriesPrompt = async () => {
  const config = await getConfig();
  if (config && config.useGit) {
    await pull();
  }
  inquirer.registerPrompt('autocomplete', autocomplete);

  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'title',
        message: 'Search for entries by content',
        source: async (answersSoFar, input) => {
          const fileNames = await fuzzySearch(input);
          const entryNames = await findEntriesByFileName(fileNames);
          return entryNames.map(e => e.title);
        },
      },
    ])
    .then(async answer => {
      const entry = await findEntryByTitle(answer.title);
      const childProcess = editor(entry.filePath);
      childProcess.on('exit', async () => {
        const text = await readFile(entry.filePath);
        const sentiment = getSentimentScore(
          text.replace(/[^\x20-\x7E]/gim, ''),
        );
        await editEntry(entry._id, { sentiment });
        await generateReadme();
        if (config && config.useGit) {
          await commit();
          await push();
        }
      });
    });
};

export default showEntriesPrompt;
