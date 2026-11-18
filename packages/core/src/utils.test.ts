import { describe, expect, it } from 'vitest';
import { sleep } from './utils.js';

describe('@pai/skills-core utils', () => {
  it('resolves sleep promise cleanly via runtime timer adapter', async () => {
    await expect(sleep(1)).resolves.toBeUndefined();
  });
});
