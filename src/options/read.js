import inquirer from 'inquirer';
import autocomplete from 'inquirer-autocomplete-prompt';
import { fuzzySearch } from '../api/files.js';
import { findEntriesByFileName, findEntryByTitle, getConfig } from '../api/db';
import { editor } from '../api/shell';
import { pull } from '../api/git';

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
      editor(entry.filePath, true);
    });
};

export default showEntriesPrompt;
