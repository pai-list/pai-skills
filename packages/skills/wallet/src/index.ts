import { PaiSkill, SkillContext, SkillMetadata } from '@pai/skills-core';
import { walletOps, WalletInput, WalletOutput } from '@pai/wallet';

export const walletSkill: PaiSkill<WalletInput, WalletOutput> = {
  name: 'pai-wallet',
  version: '1.0.0',
  description: 'Pi wallet operations for agents',
  author: 'PAI Team',
  license: 'MIT',
  price: 0.01,
  pricingModel: 'per-call',
  tags: ['wallet', 'pi-network', 'balance', 'transactions'],
  category: 'wallet',
  dependencies: ['@pai/core', '@pai/wallet'],
  peerDependencies: ['@pai/agent-kit'],
  
  async execute(input: WalletInput, context: SkillContext): Promise<WalletOutput> {
    const wallet = context.piWallet;
    
    if (!wallet) {
      throw new Error('Pi wallet required for wallet operations');
    }
    
    switch (input.action) {
      case 'balance': {
        const balance = await wallet.getBalance();
        return { balance: balance.balance, currency: balance.currency, address: wallet.address };
      }
      
      case 'transactions': {
        const txs = await wallet.getTransactions(input.limit || 20, input.offset || 0);
        return { transactions: txs };
      }
      
      case 'send': {
        if (!input.to || !input.amount) {
          throw new Error('to and amount required for send');
        }
        const tx = await wallet.send({
          to: input.to,
          amount: input.amount,
          memo: input.memo
        });
        return { transactionId: tx.id, txHash: tx.hash, status: 'pending' };
      }
      
      case 'connect': {
        const result = await wallet.connect();
        return { connected: true, address: wallet.address };
      }
      
      default:
        throw new Error(`Unknown wallet action: ${input.action}`);
    }
  },
  
  validateInput(input: any): boolean {
    return !!input.action;
  },
  
  metadata: {
    description: 'Pi wallet operations for agents',
    author: 'PAI Team',
    license: 'MIT',
    price: 0.01,
    pricingModel: 'per-call',
    tags: ['wallet', 'pi-network', 'balance', 'transactions'],
    category: 'wallet',
    dependencies: ['@pai/core', '@pai/wallet'],
    peerDependencies: ['@pai/agent-kit'],
    sandbox: 'js',
    permissions: ['wallet:read', 'wallet:write', 'network:pi-mainnet'],
    acp: { agentId: 'pai-wallet-agent' }
  }
};

export default walletSkill;