import program from 'commander';
import inquirer from 'inquirer';
import { addEntry } from './localdb';

program
  .version('0.0.1')
  .description('Tool for writing journal entries from the command line');

program
  .command('add')
  .alias('a')
  .description('Add new entry')
  .action(() => {
    var questions = [
      {
        type: 'editor',
        name: 'entry',
        message: 'Write your entry',
        validate: function(text) {
          addEntry(text);
          return true;
        },
      },
    ];

    inquirer.prompt(questions).then(function(answers) {
      console.log(JSON.stringify(answers, null, '  '));
    });
  });

program.parse(process.argv);
