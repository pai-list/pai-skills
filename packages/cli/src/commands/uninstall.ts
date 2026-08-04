import { Command } from 'commander';

export const uninstallCommand = new Command('uninstall')
  .description('Uninstall a skill')
  .argument('<name>', 'Skill name')
  .action(async (name) => {
    console.log(`Uninstalling skill: ${name}`);
  });
