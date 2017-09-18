import { cd, exec, which } from './shell';
import { jrnlPath } from './constants';
import { getConfig } from '../api/localdb';
import moment from 'moment';

export const init = async repo => {
  cd(jrnlPath);
  await exec('git init');
  await exec('git checkout -b data');
  await commit('Initializing repo for the first time');
  await setRemote(repo);
  await push();
};

export const commit = async (message = undefined) => {
  const date = moment().format('ddd, MMM Do YYYY');
  const time = moment().format('hh:ss A');
  if (!message) message = `Journal updated on ${date} at ${time}`;
  cd(jrnlPath);
  await exec('git add .');
  await exec(`git commit -m '${message}'`);
};

export const push = async () => {
  cd(jrnlPath);
  await exec('git push -u origin data');
};

export const setRemote = async repo => {
  cd(jrnlPath);
  exec(`git remote add origin ${repo}`);
};

export const isGitInstalled = () => which('git');
