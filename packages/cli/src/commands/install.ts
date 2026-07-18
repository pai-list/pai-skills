import { Command } from 'commander';

export const installCommand = new Command('install')
  .description('Install a skill locally')
  .argument('<name>', 'Skill name to install')
  .option('-v, --version <version>', 'Specific version to install')
  .option('--save', 'Save to project dependencies')
  .action(async (name, options) => {
    console.log(`Installing skill: ${name}@${options.version || 'latest'}`);
  });