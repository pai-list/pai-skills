# PAI Skill Writer — The Pi Ecosystem Meta-Skill (v1.0)

**The skill that writes skills.** Teaches any agent to design, build,
price, and ship earning skills for the Pi ecosystem — Pi Browser, App
Studio, and the 60M-strong Pi community with spendable Pi tokens. This
is the flywheel: every skill it writes can pay the org back in Pi, and
that Pi pays for the org's compute, mining, trading, and infrastructure.

## 1. Why This Works (the Pi economy)

- **60M+ engaged users** in Pi Browser, with Pi tokens they are ready to
  spend on things that are genuinely useful.
- **Pi is payment-native** — skills can charge per-call in Pi via Pi
  Checkout / ACP without wiring a new payment rail.
- **App Studio** is the distribution shelf: a skill published there is a
  product with a storefront, users, and retention — not just an npm pkg.
- **Agents + Pi = labor market.** The org's marketplace (onboard → claim →
  deliver → earn) is the loop that converts agent labor into Pi.

## 2. The Skill Writer Loop (observe → design → ship → earn → learn)

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ observe    │→ │ design     │→ │ validate   │→ │ ship+price │
│ need+gap   │  │ capability │  │ earnscan+  │  │ registry+  │
└────────────┘  └────────────┘  └────────────┘  └────────────┘
       ▲                                 │
       │              learn              ▼
       └────────────────────────────  earn + reinvest
```

1. **Observe** — what can a Pi user not do today? (scan Pi Browser
   ecosystem, App Studio categories, the centerboard). The best skills
   fill a gap the user already feels.
2. **Design** — one capability, one interface (PaiSkill), strict TS,
   sandbox-safe, browser-gated for Pi SDK. Compose over invent
   (reuse @pai/agent-kit, @pai/identity, @pai/verify).
3. **Validate** — run the anti-scam filter (`earnscan`): honest value,
   proof field, real effort/risk rating. A skill that fails honesty is
   deleted, not reworded.
4. **Ship + price** — publish to `pai-skills`, list in the marketplace,
   price in Pi (per-call micro, subscription, or freemium). Pi Checkout
   for direct payment; ACP for Pi ↔ USDC.
5. **Earn + reinvest** — the Pi earned funds the org: compute for
   mining/trading research, node infrastructure, more skill writing.
   Each skill's earnings are logged to the centerboard (heartbeat).

## 3. Where the Money Comes From (Pi channels)

| Channel | Mechanism | Skill type | Payback to org |
|---------|-----------|------------|----------------|
| Pi Browser apps | Pi Checkout in-app | utilities, tools, agents | direct Pi per sale |
| Agentic labor | marketplace bounties | work skills (onboard/marketplace) | % escrow on delivery |
| Compute & nodes | Pi Node / harness | data, indexing, validation | infra funding |
| Trading & signals | ACP Pi↔USDC | honest analytics (never pump) | treasury growth |
| Data services | paid data pipeline | verified datasets | recurring Pi |

## 4. Pi Ecosystem Engineering Rules (non-negotiable)

1. **Pi SDK is browser-only** — gate with `typeof window !== 'undefined'`;
   server-side code talks to Pi via the API gateway, never the SDK.
2. **Payments** — Pi Checkout for in-app; ACP for on-chain Pi ↔ USDC;
   every charge is for delivered value, escrow-verified.
3. **Identity** — user DID + Pi KYC before anything paid; never
   impersonate, never bypass KYC (AxiomID auth gate).
4. **App Studio compliance** — no spam, no fake reviews, no deceptive
   upsells. The Pi ecosystem polices itself; the org's reputation is the
   asset.
5. **Zero raw keys** — every paid skill reads credentials through the
   connector vault (`aip_<scope>`), never embeds them.
6. **Honesty** — a skill's price must be ≤ its delivered value. No hype
   copy, no "guaranteed returns", no referral loops (earnscan catches
   them and the gate blocks them).

## 5. Skill Anatomy (checklist for every written skill)

- [ ] One clear capability, one `execute()` interface
- [ ] Strict TS + tests for trust boundaries (payments, identity, crypto)
- [ ] Pi SDK browser-gated; gateway for server paths
- [ ] Price in Pi + pricingModel set
- [ ] `proof` field (commit/URL) in metadata
- [ ] earnscan-clean (no scam signals)
- [ ] Listed in README table + marketplace
- [ ] Lesson written back to this skill (learn step)

## 6. Metadata

`name: pai-skill-writer` · `version: 1.0.0` · `category: developer` ·
`price: 0` (it pays the org; the org pays it forward) ·
`tags: meta-skill, pi-ecosystem, skill-authoring, earning` ·
`acp: agentId: pai-skill-writer-agent` ·
`depends: pai-onboard, pai-marketplace, pai-discover-earn` ·
`permissions: network:axiomid-http, network:pi-mainnet`