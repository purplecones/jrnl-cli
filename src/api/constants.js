import os from 'os';

export const jrnlPath = `${os.homedir()}/.jrnl`;
export const filesPath = `${jrnlPath}/files`;
export const dbPath = `${jrnlPath}/data`;
export const currentEditor = process.env.EDITOR || 'vi';;
