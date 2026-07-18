import { Command } from 'commander';
import { SkillRegistry } from '@pai/skills-core';

export const listCommand = new Command('list')
  .description('List all available skills')
  .option('-c, --category <category>', 'Filter by category')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-v, --verified', 'Show only verified skills')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const registry = new (await import('@pai/skills-core')).SkillRegistry();
    
    const results = registry.search('', {
      category: options.category,
      tag: options.tag,
      verified: options.verified,
      page: 1,
      pageSize: 50,
    });

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log('\nAvailable Skills:\n');
      results.skills.forEach(skill => {
        const verified = skill.verified ? ' ✓' : '';
        const price = skill.manifest.price ? ` $${skill.manifest.price}/call` : ' Free';
        console.log(`  ${skill.manifest.name}@${skill.manifest.version}${verified}${price}`);
        console.log(`    ${skill.manifest.description}`);
        console.log('');
      });
      console.log(`Total: ${results.total} skills`);
    }
  });