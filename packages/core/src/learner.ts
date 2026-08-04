import type { 
  SkillManifest, 
  SkillContext, 
  SkillRegistryEntry, 
  SearchResult,
  SkillLogger,
  SkillStorage,
  SkillKeyManager
} from './types.js';
import { SkillRegistry } from './registry.js';
import { SkillLoader } from './loader.js';
import { getCrypto } from './runtime/node-adapters.js';

export interface SkillExecutionRecord {
  id: string;
  skillName: string;
  skillVersion: string;
  input: unknown;
  output: unknown;
  success: boolean;
  executionTimeMs: number;
  error?: string;
  timestamp: string;
  agentId: string;
  agentDid: string;
  piUserId?: string;
  piPaymentTx?: string;
  piSandboxMode?: boolean;
  permissionsUsed: string[];
  trustChainSignature?: string;
}
