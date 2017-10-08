import inquirer from 'inquirer';
import { searchFile } from '../api/files.js';
import {
  findEntryByTitle,
  findEntriesByFileName,
  getConfig,
} from '../api/db.js';
import { pull } from '../api/git';
import { cat, echo } from '../api/shell';

export default (async function() {
  const config = await getConfig();
  if (config && config.useGit) {
    await pull();
  }
  inquirer.registerPrompt(
    'autocomplete',
    require('inquirer-autocomplete-prompt'),
  );

  inquirer
    .prompt([
      {
        type: 'autocomplete',
        name: 'title',
        message: 'Search for entries by content',
        source: async (answersSoFar, input) => {
          const files = await searchFile(new RegExp(input));
          let fileNames = [];
          for (let key in files) {
            const fileParts = key.split('/');
            fileNames.push(fileParts[fileParts.length - 1]);
          }
          const entryNames = await findEntriesByFileName(fileNames);
          return entryNames.map(e => e.title);
        },
      },
    ])
    .then(async answer => {
      const entry = await findEntryByTitle(answer.title);
      const text = cat(entry.filePath);
      echo(text);
    });
});
