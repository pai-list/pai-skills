import { PaiError } from './errors.js';

export function assertSkillManifest(data: any): asserts data is { name: string; version: string; description: string } {
  if (!data || typeof data !== 'object') throw new PaiError('SKILL_400', 'Manifest must be an object');
  if (typeof data.name !== 'string') throw new PaiError('SKILL_400', 'Manifest.name must be a string');
  if (typeof data.version !== 'string') throw new PaiError('SKILL_400', 'Manifest.version must be a string');
  if (typeof data.description !== 'string') throw new PaiError('SKILL_400', 'Manifest.description must be a string');
}

export function sanitizeSkillName(name: string): string {
  return name.replace(/[^a-z0-9-@/]/gi, '-').toLowerCase();
}

export function validatePermissions(permissions: string[], required: string[]): boolean {
  return required.every(p => permissions.includes(p));
}
