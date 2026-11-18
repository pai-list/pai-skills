<div align="center">

```ascii
 ╔═══════════════════════════════════════════════════════════════════════════╗
 ║   _  _  _  _  _  ____  _  _  _  _  _  ____  ____  _  _  ____  ____  ____  ║
 ║  / )( \( \/ )( \/ ___)( \/ )( \/ )( \/ ___)(  _ \( \/ )/ ___)/ ___)(  _ \ ║
 ║  ) __ ( )  (  ) )\___ \ )  /  )  (  ) )\___ \ ) __/ )  / \___ \\___ \ ) __/ ║
 ║  \_)(_/(_/\_)(_/ (____/(_/   (_/\_)(_/ (____/(__)  (_/  (____/(____/(__)   ║
 ║                                                                           ║
 ║                 A X I O M  I D  |  P A I  U N I V E R S E                 ║
 ╚═══════════════════════════════════════════════════════════════════════════╝
```

</div>
# PAI Skills

> **PAI** — *Pi + AI.* The agent skill marketplace for Pi Network.

A public directory of composable skills for AI agents on Pi Network. Browse, discover, and compose skills like building blocks.

## What Is This?

Inspired by [solanaskills.com](https://solanaskills.com), PAI Skills is the registry of everything an AI agent can **do** on Pi Network. Each skill is a self-contained module that an agent can load, use, and combine.

```
PAI Skills = The "App Store" for agent capabilities on Pi
```

## Skills

| Skill | Package | What It Does | Status |
|---|---|---|---|
| **PAI Verify** | `@pai/verify` | Human verification via Pi KYC | ✅ Live |
| **PAI ID** | `@pai/identity` | DID creation + OpenIdentity manifests | ✅ Live |
| **PAI Trust** | `@pai/identity` | Trust scoring via AxiomID TrustChain | ✅ Live |
| **PAI Pay** | `@pai/payments` | Pi ↔ USDC payments via ACP | 🔧 Building |
| **PAI Wallet** | `@pai/wallet` | Pi wallet management for agents | 🔧 Building |
| **PAI Did Resolve** | `@pai/identity` | Resolve any `did:pai:*` | 🔧 Building |
| **PAI Verify Proof** | `@pai/verify` | Verify an existing proof hash | 🔧 Building |
| **PAI Onboard** | `@pai/skill-onboard` | 6-step entry loop: read → register → claim → apply → deliver | 🔨 New |
| **PAI Marketplace** | `@pai/skill-marketplace` | The zero-cost labor market loop (compounding) | 🔨 New |
| **PAI Earn Discovery** | `@pai/skill-discover-earn` | Honest earn-path scanner with anti-scam filter | 🔨 New |
| **PAI Skill Writer** | `@pai/skill-writer` | The meta-skill: write earning skills for the Pi ecosystem (60M users) | 🔨 New |

## How to Add a Skill

```bash
# Anyone can contribute
npm create pai-skill my-skill
# Implements the PAI Skill interface
# Submit PR to pai-list/skills
```

## Skill Interface

Every skill must export:

```typescript
interface PaiSkill {
  name: string;
  description: string;
  version: string;
  execute(input: any): Promise<any>;
  metadata: {
    author: string;
    price?: number;       // USDC price in ACP marketplace
    requires?: string[];  // Dependencies
  };
}
```

## Browse Online

Coming soon at `skills.pai.build`

## Marketplace Integration

Skills can be listed on Virtuals ACP as priced offerings. When an agent uses a skill in a job, payment flows through escrow automatically.

## License

PiOS — Pi Open Source License

---

**PAI Skills.** Every agent needs capabilities. This is where they find them.
