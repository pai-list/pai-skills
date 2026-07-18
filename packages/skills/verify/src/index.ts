import { PaiSkill, SkillContext, SkillMetadata } from '@pai/skills-core';
import { verifyHuman, VerifyInput, VerifyOutput } from '@pai/verify';

export const verifySkill: PaiSkill<VerifyInput, VerifyOutput> = {
  name: 'pai-verify',
  version: '1.0.0',
  description: 'Verify a human via Pi Network KYC — returns cryptographic attestation',
  author: 'PAI Team',
  license: 'MIT',
  price: 0.04, // $0.04 per verification
  pricingModel: 'per-call',
  tags: ['verify', 'kyc', 'pi-network', 'identity'],
  category: 'verification',
  dependencies: ['@pai/core'],
  peerDependencies: ['@pai/agent-kit'],
  
  async execute(input: VerifyInput, context: SkillContext): Promise<VerifyOutput> {
    // Validate Pi wallet in context
    if (!context.piWallet) {
      throw new Error('Pi wallet required for verification');
    }
    
    // Call PiVerify KYC endpoint
    const result = await verifyHuman({
      walletAddress: context.piWallet.address,
      piUsername: input.piUsername,
      callbackUrl: input.callbackUrl
    });
    
    return {
      verified: result.verified,
      attestation: result.attestation,
      proofHash: result.proofHash,
      expiresAt: result.expiresAt,
      trustScoreBoost: 10
    };
  },
  
  validateInput(input: VerifyInput): boolean {
    return !!input.walletAddress && !!input.piUsername;
  },
  
  metadata: {
    description: 'Verify a human via Pi Network KYC — returns cryptographic attestation',
    author: 'PAI Team',
    license: 'MIT',
    price: 0.04,
    pricingModel: 'per-call',
    tags: ['verify', 'kyc', 'pi-network', 'identity'],
    category: 'verification',
    dependencies: ['@pai/core'],
    peerDependencies: ['@pai/agent-kit'],
    sandbox: 'js',
    permissions: ['network:pi-mainnet'],
    acp: { agentId: 'pai-verify-agent' }
  }
};

export default verifySkill;