import program from 'commander';
import { add, read } from './options';

program
  .version('0.0.1')
  .description('Tool for writing journal entries from the command line');

program
  .command('add')
  .alias('a')
  .description('Add new entry')
  .action(() => add());

program
  .command('read')
  .alias('r')
  .description('Read an entry')
  .action(() => read());

program.parse(process.argv);
