import moment from 'moment';
import { cd, exec, which } from './shell';
import { jrnlPath } from './constants';

export const commit = async (message = undefined) => {
  console.log('Committing git repo.');
  const date = moment().format('ddd, MMM Do YYYY');
  const time = moment().format('hh:ss A');
  if (!message) {
    // eslint-disable-next-line
    message = `Journal updated on ${date} at ${time}`;
  }
  cd(jrnlPath);
  await exec('git add .');
  try {
    await exec(`git commit -m '${message}'`);
  } catch (e) {
    console.error(e);
  }
};

export const push = async () => {
  console.log('Pushing to git remote.');
  cd(jrnlPath);
  await exec('git push -u origin data');
};

export const pull = async () => {
  console.log('Pulling latest from git remote.');
  cd(jrnlPath);
  await exec('git pull');
};

export const setRemote = async repo => {
  console.log('Setting git remote.');
  cd(jrnlPath);
  exec(`git remote add origin ${repo}`);
};

export const init = async repo => {
  cd(jrnlPath);
  await exec('git init');
  await exec('git checkout -b data');
  await commit('Initializing repo for the first time');
  await setRemote(repo);
  await push();
};
export const isGitInstalled = () => which('git');
