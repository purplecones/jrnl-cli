import inquirer from 'inquirer';
import { updateConfig } from '../api/db';
import { pathExists } from '../api/shell';
import { jrnlPath } from '../api/constants';
import { init, pull, isGitInstalled } from '../api/git';

export default async () => {
  await pull();
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
      if (answers.configOptions === 'git') {
        if (!isGitInstalled) {
          console.log('git is not installed. Install it before running this.');
          process.exit(1);
        }
      }

      await updateConfig({ useGit: answers.git, repo: answers.repo });

      if (await pathExists(`${jrnlPath}/.git`)) {
        console.log(
          '.git folder already exits. Config saved however you might run into sync issues. Remove the .git folder and run this command again.',
        );
      } else {
        await init(answers.repo);
      }
    });
};
