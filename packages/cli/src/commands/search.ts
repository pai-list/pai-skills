import { Command } from 'commander';

export const searchCommand = new Command('search')
  .description('Search for skills')
  .argument('<query>', 'Search query')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (query, options) => {
    console.log(`Searching for skills with query: ${query}`);
  });
