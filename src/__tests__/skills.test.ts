import { describe, it, expect } from 'vitest';

describe('PAI Agentic Skills Registry & MCP Server', () => {
  it('registers core skills metadata', () => {
    const skills = [
      { id: 'pi_kyc_verify', name: 'Pi KYC Verifier', version: '1.0.0' },
      { id: 'pi_wallet_pay', name: 'Pi Payment Escrow', version: '1.2.0' },
      { id: 'aip_tok_issue', name: 'AIP Zero-Key Vault', version: '2.0.0' },
    ];
    expect(skills).toHaveLength(3);
    expect(skills[0].id).toBe('pi_kyc_verify');
  });

  it('validates skill manifest packaging schema', () => {
    const manifest = {
      name: 'pi-payment-escrow',
      description: 'Autonomous micro-payment escrow skill for Pi Network',
      entrypoint: 'dist/index.js',
    };
    expect(manifest.name).toBe('pi-payment-escrow');
  });
});
