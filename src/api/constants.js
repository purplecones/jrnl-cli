import os from 'os';

export const filesPath = `${os.homedir()}/.jrnl/files`;
export const dbPath = `${os.homedir()}/.jrnl/data`;
export const currentEditor = process.env.EDITOR || 'vi';;
