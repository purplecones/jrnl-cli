import program from 'commander';
import { add, read, edit, config } from './options';

program
  .version('0.0.9')
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

program
  .command('edit')
  .alias('e')
  .description('Edit an entry')
  .action(() => edit());

program
  .command('config')
  .alias('c')
  .description('Configure tool')
  .action(() => config());

program.parse(process.argv);
