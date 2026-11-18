import { Command } from 'commander';

export const initCommand = new Command('init')
  .description('Create a new skill scaffold')
  .argument('<name>', 'Skill name')
  .option('-c, --category <category>', 'Skill category', 'utility')
  .option('--author <author>', 'Author name')
  .action(async (name, _options) => {
    console.log(`Creating skill scaffold: ${name}`);
  });
