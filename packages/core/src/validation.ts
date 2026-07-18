import { z } from 'zod';

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
  entryPoint: z.string(),
  mainExport: z.string().optional(),
  checksum: z.string().length(64),
  publishedAt: z.string().datetime({ offset: true }),
  downloads: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).optional(),
  verified: z.boolean().default(false),
});

// Skill context schema
export const SkillContextSchema = z.object({
  agentId: z.string(),
  agentDid: z.string(),
  piWallet: z.object({
    address: z.string(),
    publicKey: z.string(),
    network: z.enum(['mainnet', 'testnet']),
  }).optional(),
  piUser: z.object({
    username: z.string(),
    kycStatus: z.enum(['verified', 'pending', 'unverified']),
  }).optional(),
  acpJobId: z.string().optional(),
  paymentEscrow: z.object({
    amount: z.number(),
    currency: z.enum(['USDC', 'PI']),
    status: z.enum(['locked', 'released', 'refunded']),
  }).optional(),
  config: z.record(z.unknown()),
  secrets: z.record(z.string()),
});

// ============================================
// REGISTRY SCHEMAS
// ============================================

export const SkillRegistryEntrySchema = z.object({
  manifest: z.object({
    name: z.string(),
    version: z.string(),
    description: z.string(),
    author: z.string(),
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
    entryPoint: z.string(),
    mainExport: z.string().optional(),
    checksum: z.string().length(64),
    publishedAt: z.string().datetime({ offset: true }),
    downloads: z.number().int().nonnegative().default(0),
    rating: z.number().min(0).max(5).optional(),
    verified: z.boolean().default(false),
  }),
  installCount: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
  verified: z.boolean(),
  author: z.string(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  totalRevenue: z.number().nonnegative(),
  callsLast24h: z.number().int().nonnegative(),
  callsAllTime: z.number().int().nonnegative(),
  uptime: z.number().min(0).max(100),
  avgLatency: z.number().nonnegative(),
  errorRate: z.number().min(0).max(1),
});

export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  verified: z.boolean().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['downloads', 'rating', 'price', 'updated', 'created']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const SearchResultSchema = z.object({
  skills: z.array(z.any()),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
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
  input: z.unknown(),
  context: z.unknown().optional(),
});

export const SkillExecutionOutputSchema = z.object({
  result: z.unknown(),
  receipt: z.object({
    skillName: z.string(),
    skillVersion: z.string(),
    inputHash: z.string(),
    outputHash: z.string(),
    executionTimeMs: z.number().int().nonnegative(),
    gasUsed: z.number().int().nonnegative().optional(),
    timestamp: z.string().datetime({ offset: true }),
    signature: z.string(),
  }),
  receipts: z.array(z.unknown()).optional(),
});

export const SkillErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
  retryable: z.boolean().default(false),
});

// ============================================
// REGISTRY API SCHEMAS
// ============================================

export const PublishSkillRequestSchema = z.object({
  manifest: z.any(),
  bundle: z.string(),
  signature: z.string(),
});

export const PublishSkillResponseSchema = z.object({
  success: z.boolean(),
  skillId: z.string(),
  version: z.string(),
  message: z.string().optional(),
});

export const InstallSkillRequestSchema = z.object({
  skillName: z.string(),
  version: z.string().optional(),
  targetDir: z.string().optional(),
});

export const InstallSkillResponseSchema = z.object({
  success: z.boolean(),
  skillName: z.string(),
  version: z.string(),
  installPath: z.string(),
  dependenciesInstalled: z.array(z.string()).optional(),
});

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateSkillManifest(data: unknown): { success: true; data: z.infer<typeof SkillManifestSchema> } | { success: false; error: z.ZodError } {
  const result = SkillManifestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function validateSkillContext(data: unknown): { success: true; data: z.infer<typeof SkillContextSchema> } | { success: false; error: z.ZodError } {
  const result = SkillContextSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function validateSkillManifestFile(content: string): { success: true; data: z.infer<typeof SkillManifestSchema> } | { success: false; error: Error } {
  try {
    const parsed = JSON.parse(content);
    return validateSkillManifest(parsed);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export function validateSkillManifestYaml(content: string): { success: true; data: z.infer<typeof SkillManifestSchema> } | { success: false; error: Error } {
  try {
    const yaml = require('yaml');
    const parsed = yaml.parse(content);
    return validateSkillManifest(parsed);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}