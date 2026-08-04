import { Command } from 'commander';

export const listTemplatesCommand = new Command('templates')
  .description('List available skill templates')
  .action(async () => {
    console.log('Available templates:');
  });
