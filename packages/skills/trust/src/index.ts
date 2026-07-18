import { PaiSkill, SkillContext, SkillMetadata } from '@pai/skills-core';
import { getTrustScore, TrustInput, TrustOutput } from '@pai/trust';

export const trustSkill: PaiSkill<TrustInput, TrustOutput> = {
  name: 'pai-trust',
  version: '1.0.0',
  description: 'Get trust score for an address via TrustChain',
  author: 'PAI Team',
  license: 'MIT',
  price: 0.02,
  pricingModel: 'per-call',
  tags: ['trust', 'reputation', 'trustchain', 'axiomid'],
  category: 'trust',
  dependencies: ['@pai/core', '@pai/identity'],
  peerDependencies: ['@pai/agent-kit'],
  
  async execute(input: TrustInput, context: SkillContext): Promise<TrustOutput> {
    const address = input.address || context.piWallet?.address;
    
    if (!address) {
      throw new Error('Address required for trust scoring');
    }
    
    const result = await getTrustScore(address, {
      includeBreakdown: true,
      includeHistory: input.includeHistory || false
    });
    
    return {
      score: result.value,
      level: result.level,
      factors: result.factors,
      breakdown: result.breakdown,
      history: result.history,
      lastUpdated: result.lastUpdated
    };
  },
  
  validateInput(input: TrustInput): boolean {
    return !!input.address;
  },
  
  metadata: {
    description: 'Get trust score for an address via AxiomID TrustChain',
    author: 'PAI Team',
    license: 'MIT',
    price: 0.02,
    pricingModel: 'per-call',
    tags: ['trust', 'reputation', 'trustchain', 'axiomid'],
    category: 'trust',
    dependencies: ['@pai/core', '@pai/identity'],
    peerDependencies: ['@pai/agent-kit'],
    sandbox: 'js',
    permissions: ['network:pi-mainnet'],
    acp: { agentId: 'pai-trust-agent' }
  }
};

export default trustSkill;