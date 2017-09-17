import inquirer from 'inquirer';
import { updateConfig } from '../api/localdb';
import { pathExists } from '../api/shell';
import { jrnlPath } from '../api/constants';
import { init } from '../api/git';

export default async () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'configOptions',
        message: 'What do you want to configure?',
        choices: ['git'],
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Use git for backup?',
        when: answers => answers.configOptions === 'git',
      },
      {
        type: 'input',
        name: 'repo',
        message: 'What repo should your jrnl be pushed to?',
        when: answers => answers.git,
      },
    ])
    .then(async answers => {
      if (answers.configOptions === 'git')
        await updateConfig({ useGit: answers.git, repo: answers.repo });
        if (!await pathExists(`${jrnlPath}/.git`)) {
          init();
        } else {
          throw Error('.git folder already exits')
        }
    });
};
