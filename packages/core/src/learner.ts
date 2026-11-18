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
