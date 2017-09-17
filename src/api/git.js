import { cd, exec } from './shell';
import { jrnlPath } from './constants';
import moment from 'moment';

export const init = () => {
  cd(jrnlPath);
  exec('git init');
  commit();
  setRemote();
};

export const commit = () => {
  cd(jrnlPath);
  exec('git add .');
  exec(
    `git commit -m 'Journal update for ${moment().format('ddd, MMM Do YYYY')}'`,
  );
};

export const push = () => {
  cd(jrnlPath);
  exec('git push -u origin master');
};

export const setRemote = () => {
  cd(jrnlPath);
  exec('git remote add origin https://github.com/purplecones/jrnl.git');
};