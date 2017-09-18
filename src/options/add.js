import inquirer from 'inquirer';
import moment from 'moment';
import changeCase from 'change-case';
import { filesPath } from '../api/constants';
import { writeFile } from '../api/files';
import { addEntry, findEntries } from '../api/localdb';
import { init, commit, push } from '../api/git';
import { getConfig } from '../api/localdb';
import { getSentimentScore } from '../api/sentiment';
import { generateReadme } from '../api/common';

export default () => {
  const questions = [
    {
      type: 'editor',
      name: 'entry',
      message: 'Write your entry',
      validate: async text => {
        const date = new Date();
        const textLines = text.split('\n');
        const title = textLines[0];
        const mdTitle = `## ${textLines[0]}`;
        const mdDate = `###### Written on ${moment(date).format(
          'ddd, MMM Do YYYY',
        )} at ${moment(date).format('hh:ss A')}`;
        const modifiedTextLines = [mdTitle, mdDate, ...textLines.slice(1)];
        const content = modifiedTextLines.join('\n');
        const fileName = `${moment(date).format(
          'YYYYMMDDHHMM',
        )}-${changeCase.headerCase(title)}.md`;
        const filePath = `${filesPath}/${fileName}`;
        // remove newlines for sentiment analysis
        const sentiment = getSentimentScore(text.replace(/[^\x20-\x7E]/gmi, ""));

        await writeFile(filePath, content);
        await addEntry({
          title,
          fileName,
          filePath,
          date,
          sentiment,
        });

        await generateReadme();

        // commit and push using git if enabled
        const config = await getConfig();
        if (config && config.useGit) {
          await commit();
          await push();
        }

        return true;
      },
    },
  ];
  inquirer.prompt(questions);
};
