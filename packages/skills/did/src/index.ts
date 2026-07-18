import { PaiSkill, SkillContext, SkillMetadata } from '@pai/skills-core';
import { createDID, resolveDID, DIDInput, DIDOutput } from '@pai/identity';

export const didSkill: PaiSkill<DIDInput, DIDOutput> = {
  name: 'pai-did',
  version: '1.0.0',
  description: 'Create and resolve did:agent DIDs',
  author: 'PAI Team',
  license: 'MIT',
  price: 0.05,
  pricingModel: 'per-call',
  tags: ['did', 'identity', 'axiomid', 'agent'],
  category: 'identity',
  dependencies: ['@pai/core', '@pai/identity'],
  peerDependencies: ['@pai/agent-kit'],
  
  async execute(input: DIDInput, context: SkillContext): Promise<DIDOutput> {
    if (input.action === 'create') {
      const did = await createDID({
        controller: context.agentDid,
        publicKey: input.publicKey,
        services: {
          mcp: `https://mcp.pai.build/agent/${context.agentDid}`,
          skills: `https://skills.pai.build/agent/${context.agentDid}`,
          payments: `https://acp.virtuals.io/agent/${context.agentDid}`
        }
      });
      return { did, document: did.document };
    }
    
    if (input.action === 'resolve') {
      const document = await resolveDID(input.did);
      return { did: input.did, document };
    }
    
    throw new Error('Invalid action: must be "create" or "resolve"');
  },
  
  validateInput(input: DIDInput): boolean {
    return input.action === 'create' || input.action === 'resolve';
  },
  
  metadata: {
    description: 'Create and resolve did:agent DIDs',
    author: 'PAI Team',
    license: 'MIT',
    price: 0.05,
    pricingModel: 'per-call',
    tags: ['did', 'identity', 'axiomid', 'agent'],
    category: 'identity',
    dependencies: ['@pai/core', '@pai/identity'],
    peerDependencies: ['@pai/agent-kit'],
    sandbox: 'js',
    permissions: ['network:pi-mainnet'],
    acp: { agentId: 'pai-did-agent' }
  }
};

export default didSkill;