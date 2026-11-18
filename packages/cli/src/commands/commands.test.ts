import { describe, expect, it } from 'vitest';
import { initCommand } from './init.js';
import { listCommand } from './list.js';
import { publishCommand } from './publish.js';
import { searchCommand } from './search.js';

describe('@pai/skills-cli commands', () => {
  it('registers core CLI command names', () => {
    expect(initCommand.name()).toBe('init');
    expect(listCommand.name()).toBe('list');
    expect(publishCommand.name()).toBe('publish');
    expect(searchCommand.name()).toBe('search');
  });
});
