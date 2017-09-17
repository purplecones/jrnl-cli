import inquirer from 'inquirer';
import { updateConfig } from '../api/localdb';

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
    .then(answers => {
      if (answers.configOptions === 'git')
        updateConfig({ useGit: answers.git, repo: answers.repo });
    });
};
