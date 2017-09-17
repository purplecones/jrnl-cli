import inquirer from 'inquirer';
import moment from 'moment';
import changeCase from 'change-case';
import { filesPath, jrnlPath } from '../api/constants';
import { writeFile } from '../api/files';
import { addEntry } from '../api/localdb';
import { pathExists } from '../api/shell';
import { init, commit, push } from '../api/git';
import { getConfig } from '../api/localdb';

export default () => {
  const questions = [
    {
      type: 'editor',
      name: 'entry',
      message: 'Write your entry',
      validate: async text => {
        const textLines = text.split('\n');
        const title = textLines[0];
        const date = new Date();
        textLines[0] = `# ${textLines[0]}`;
        const content = textLines.join('\n');
        const fileName = `${moment(date).format(
          'YYYYMMDD',
        )}-${changeCase.headerCase(title)}.md`;
        const filePath = `${filesPath}/${fileName}`;

        await writeFile(filePath, content);
        await addEntry({
          title,
          filePath,
          date,
        });

        // commit and push using git if enabled
        const config = await getConfig();
        if (config.useGit) {
          if (!pathExists(`${jrnlPath}/.git`)) init();
          commit();
          push();
        }

        return true;
      },
    },
  ];
  inquirer.prompt(questions);
};
