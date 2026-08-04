import { z } from 'zod';
import { getRequire } from './runtime/node-adapters.js';

// ============================================
// CORE SCHEMAS - Define ONCE
// ============================================

// Skill metadata schema
export const SkillMetadataSchema = z.object({
  description: z.string().min(10).max(200),
  author: z.string().min(1),
  license: z.string(),
  price: z.number().nonnegative().optional(),
  pricingModel: z.enum(['per-call', 'subscription', 'freemium']).optional(),
  dependencies: z.array(z.string()).optional(),
  peerDependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.enum([
    'identity', 'verification', 'trust', 'payment', 'wallet',
    'automation', 'data', 'ai-ml', 'commerce', 'developer',
    'monitoring', 'security', '3d-visual'
  ]).optional(),
  sandbox: z.enum(['wasm', 'js', 'native']),
  permissions: z.array(z.string()),
  acp: z.object({ agentId: z.string() }),
});

// Skill manifest schema (for registry)
export const SkillManifestSchema = z.object({
  name: z.string().regex(/^[@a-z][a-z0-9-]*(\/[a-z0-9-]+)?$/),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/),
  description: z.string().min(10).max(200),
  author: z.string().min(1),
  license: z.string(),
  price: z.number().nonnegative().optional(),
  pricingModel: z.enum(['per-call', 'subscription', 'freemium']).optional(),
  dependencies: z.array(z.string()).optional(),
  peerDependencies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.enum([
    'identity', 'verification', 'trust', 'payment', 'wallet',
    'automation', 'data', 'ai-ml', 'commerce', 'developer',
    'monitoring', 'security', '3d-visual'
  ]).optional(),
  sandbox: z.enum(['wasm', 'js', 'native']),
  permissions: z.array(z.string()),
  acp: z.object({ agentId: z.string() }),
});

// Validation function
export function validateSkillManifest(data: unknown): { success: true; data: z.infer<typeof SkillManifestSchema> } | { success: false; error: Error } {
  try {
    const parsed = SkillManifestSchema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export function validateSkillManifestYaml(content: string): { success: true; data: z.infer<typeof SkillManifestSchema> } | { success: false; error: Error } {
  try {
    const require = getRequire();
    const yaml = require('yaml');
    const parsed = yaml.parse(content);
    return validateSkillManifest(parsed);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// ============================================
// REGISTRY SCHEMAS
// ============================================

export const SkillRegistryEntrySchema = z.object({
  manifest: z.object({
    name: z.string(),
    version: z.string(),
    description: z.string().min(10).max(200),
    author: z.string().min(1),
    license: z.string(),
  }),
  instance: z.object({ id: z.string() }),
});

export const RegistryStatsSchema = z.object({
  totalSkills: z.number().int().nonnegative(),
  totalDownloads: z.number().int().nonnegative(),
  totalAuthors: z.number().int().nonnegative(),
  categories: z.record(z.number().int().nonnegative()),
});

// ============================================
// EXECUTION SCHEMAS
// ============================================

export const SkillExecutionInputSchema = z.object({
  skillName: z.string(),
  skillVersion: z.string().optional(),
});
