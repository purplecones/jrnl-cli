import moment from 'moment';
import { getMarkdownTable } from './markdown';
import { findEntries } from './localdb';
import { writeFile } from './files';
import { jrnlPath } from '../api/constants';

export const generateReadme = async () => {
  const entries = await findEntries();
  const markdownData = entries.map((entry, i) => {
    return [
      moment(entry.date).format('ddd, MMM Do YYYY'),
      `[${entry.title}](files/${entry.fileName})`,
      entry.sentiment.score,
    ];
  });
  const markdownTable = getMarkdownTable([
    ['Date', 'Title', 'Sentiment'],
    ...markdownData,
  ]);

  await writeFile(`${jrnlPath}/README.md`, markdownTable);
};
