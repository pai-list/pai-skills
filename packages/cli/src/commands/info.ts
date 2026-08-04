import { Command } from 'commander';

export const infoCommand = new Command('info')
  .description('Show information about a skill')
  .argument('<name>', 'Skill name')
  .action(async (name) => {
    console.log(`Getting info for skill: ${name}`);
  });
