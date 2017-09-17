import inquirer from 'inquirer';
import moment from 'moment';
import changeCase from 'change-case';
import { filesPath } from '../api/constants';
import { writeFile } from '../api/files';
import { addEntry } from '../api/localdb';

export default () => {
  const questions = [
    {
      type: 'editor',
      name: 'entry',
      message: 'Write your entry',
      validate: async text => {
        const textLines = text.split('\n');
        const title = textLines[0];
        const content = textLines.slice(1).join('\n');
        const date = new Date();
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

        return true;
      },
    },
  ];
  inquirer.prompt(questions);
};
