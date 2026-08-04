import { Command } from 'commander';

export const publishCommand = new Command('publish')
  .description('Publish a skill to the registry')
  .argument('<path>', 'Path to skill directory')
  .option('--dry-run', 'Validate without publishing')
  .action(async (path, options) => {
    console.log(`Publishing skill from: ${path}`);
  });
