import { Command } from 'commander';

export const searchCommand = new Command('search')
  .description('Search for skills')
  .argument('<query>', 'Search query')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-v, --verified', 'Show only verified skills')
  .option('--json', 'Output as JSON')
  .action(async (query, options) => {
    // TODO: Implement search
    console.log(`Searching for: ${query}`);
  });