import { PaiSkill, SkillContext, SkillMetadata } from '@pai/skills-core';
import { pay, PayInput, PayOutput } from '@pai/payments';

export const paySkill: PaiSkill<PayInput, PayOutput> = {
  name: 'pai-pay',
  version: '1.0.0',
  description: 'Send Pi/USDC payments via ACP',
  author: 'PAI Team',
  license: 'MIT',
  price: 0.01, // $0.01 per payment
  pricingModel: 'per-call',
  tags: ['payment', 'acp', 'pi-network', 'usdc'],
  category: 'payment',
  dependencies: ['@pai/core', '@pai/payments'],
  peerDependencies: ['@pai/agent-kit'],
  
  async execute(input: PayInput, context: SkillContext): Promise<PayOutput> {
    // Input validation
    if (!input.to || !input.amount || !input.asset) {
      throw new Error('to, amount, and asset required');
    }
    
    // Create invoice via ACP
    const invoice = await context.payments.createInvoice({
      to: input.to,
      amount: input.amount,
      asset: input.asset,
      description: input.memo || 'Agent payment',
      expiresIn: '15m',
      metadata: {
        idempotencyKey: input.idempotencyKey || `pay-${Date.now()}`,
        agentDid: context.agentDid
      }
    });
    
    // Wait for settlement (with timeout)
    const settlement = await context.payments.waitForSettlement(invoice.id, {
      timeout: 60000, // 60 seconds
      pollInterval: 2000
    });
    
    // Generate receipt
    const receipt = await context.identity.signReceipt({
      type: 'payment',
      from: context.agentDid,
      to: input.to,
      amount: input.amount,
      asset: input.asset,
      invoiceId: invoice.id,
      txHash: settlement.txHash,
      timestamp: new Date().toISOString()
    });
    
    return {
      receipt,
      invoiceId: invoice.id,
      txHash: settlement.txHash,
      settled: true
    };
  },
  
  validateInput(input: PayInput): boolean {
    return !!input.to && !!input.amount && !!input.asset;
  },
  
  metadata: {
    description: 'Send Pi/USDC payments via ACP',
    author: 'PAI Team',
    license: 'MIT',
    price: 0.01, // $0.01 per payment (plus amount)
    pricingModel: 'per-call',
    tags: ['payment', 'acp', 'pi-network', 'usdc'],
    category: 'payment',
    dependencies: ['@pai/core', '@pai/payments'],
    peerDependencies: ['@pai/agent-kit'],
    sandbox: 'js',
    permissions: ['wallet:write', 'network:pi-mainnet'],
    acp: { agentId: 'pai-pay-agent' }
  }
};

export default paySkill;