// pai-skills/packages/core/src/types.ts
// Single source of truth for all PAI types — NO DUPLICATES

export interface SkillLogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export interface SkillStorage {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
}

export interface SkillHttpClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;
  post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T>;
  put<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T>;
  delete<T>(url: string, headers?: Record<string, string>): Promise<T>;
}

export interface SkillKeyManager {
  sign(data: string): Promise<string>;
  verify(data: string, signature: string, publicKey: string): Promise<boolean>;
  getPublicKey(): Promise<string>;
  getAddress(): Promise<string>;
}

export interface SkillSigner {
  sign(message: string): Promise<string>;
  verify(message: string, signature: string): Promise<boolean>;
}

export type SkillCategory =
  | 'identity' | 'verification' | 'trust' | 'payment' | 'wallet'
  | 'automation' | 'data' | 'ai-ml' | 'commerce' | 'developer'
  | 'monitoring' | 'security' | '3d-visual';

export type SandboxType = 'wasm' | 'js' | 'native';

export interface SkillMetadata {
  description: string;
  author: string;
  license: string;
  price?: number;
  pricingModel?: 'per-call' | 'subscription' | 'freemium';
  dependencies?: string[];
  peerDependencies?: string[];
  tags?: string[];
  category?: SkillCategory;
  sandbox: SandboxType;
  permissions: string[];
  acp: { agentId: string };
}

export interface PaiSkill<TIn = unknown, TOut = unknown> {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  price?: number;
  pricingModel?: 'per-call' | 'subscription' | 'freemium';
  dependencies?: string[];
  peerDependencies?: string[];
  tags?: string[];
  category?: SkillCategory;
  sandbox: SandboxType;
  permissions: string[];
  acp: { agentId: string };
  execute(input: TIn, context: SkillContext): Promise<TOut>;
  validateInput(input: TIn): boolean;
  metadata: SkillMetadata;
}

export interface SkillContext {
  agentId: string;
  agentDid: string;
  piWallet?: PiWalletContext;
  piUser?: PiUserContext;
  acpJobId?: string;
  paymentEscrow?: PaymentEscrow;
  config: Record<string, unknown>;
  secrets: Record<string, string>;
  logger: SkillLogger;
  storage: SkillStorage;
  http: SkillHttpClient;
  keyManager?: SkillKeyManager;
}

export interface PiWalletContext {
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
}

export interface PiUserContext {
  username: string;
  kycStatus: 'verified' | 'pending' | 'unverified';
}

export interface PaymentEscrow {
  amount: number;
  currency: 'USDC' | 'PI';
  status: 'locked' | 'released' | 'refunded';
  transactionHash?: string;
}

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  price?: number;
  pricingModel?: 'per-call' | 'subscription' | 'freemium';
  dependencies?: string[];
  peerDependencies?: string[];
  tags?: string[];
  category?: SkillCategory;
  sandbox: SandboxType;
  permissions: string[];
  acp: { agentId: string };
  entryPoint: string;
  mainExport?: string;
  checksum: string;
  publishedAt: string;
  downloads: number;
  rating?: number;
  verified: boolean;
}

export interface SkillRegistryEntry {
  manifest: SkillManifest;
  installCount: number;
  rating: number;
  verified: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
  totalRevenue: number;
  callsLast24h: number;
  callsAllTime: number;
  uptime: number;
  avgLatency: number;
  errorRate: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  verified?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  author?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'downloads' | 'rating' | 'price' | 'updated' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  skills: SkillRegistryEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RegistryStats {
  totalSkills: number;
  totalDownloads: number;
  totalAuthors: number;
  categories: Record<string, number>;
}

export type SkillExecutionInput = {
  skillName: string;
  skillVersion?: string;
  input: unknown;
  context?: unknown;
};

export type SkillExecutionOutput = {
  result: unknown;
  receipt: {
    skillName: string;
    skillVersion: string;
    inputHash: string;
    outputHash: string;
    executionTimeMs: number;
    gasUsed?: number;
    timestamp: string;
    signature: string;
  };
};

export type SkillError = {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
};

export type PublishSkillRequest = {
  manifest: unknown;
  bundle: string;
  signature: string;
};

export type PublishSkillResponse = {
  success: boolean;
  skillId: string;
  version: string;
  message?: string;
};

export type InstallSkillRequest = {
  skillName: string;
  version?: string;
  targetDir?: string;
};

export type InstallSkillResponse = {
  success: boolean;
  skillName: string;
  version: string;
  installPath: string;
  dependenciesInstalled?: string[];
};
