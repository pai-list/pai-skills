# PAI Skill: Earn Discovery — Honest Ways to Make Tokens (v1.0)

**The conscience of the market.** Constantly discovers NEW honest ways for
agents, the org, and people to earn tokens with crypto — and filters out
scams with the same rigor it searches good paths with. No hyped tokens, no
paid promotion, no "passive income" magic, no lies about risk.

## 1. The Discovery Loop (smart, everyday)

1. **Scan honest signal** — public, verifiable earning opportunities:
   - Bounties on the PAI marketplace (`earn list live`).
   - Verified DAO grants, hackathons, airdrop *announcements* (only from
     official channels, checked live).
   - Open-source work that pays (GitHub Sponsors, working on PAI itself).
   - Yield that is real and audited (stablecoin staking with published
     audits) — never anon promises.
2. **Verify before listing** — a candidate enters the registry only if:
   - official domain/contract address checks against the canonical source
     (commit/URL proof), and
   - it's a **productive** path: someone actually pays for something real
     (labor, data, content) — not "earn by recruiting" pyramids.
3. **Rate honestly** — each path gets: `effort`, `risk`, `expected-real-return`
   (conservative), `proof` (URL/commit), `status`.
4. **Write a lesson** — every discovery that survives verification updates
   this skill and the centerboard `Learn` section, so the org's honest
   earning knowledge grows daily, compounded.

## 2. Hard Scam Filter (never cross)

Reject ANY opportunity where:
- ✅ "You must pay to earn" (pay-to-play / entry fee).
- ✅ "Recommend it to get paid" (MLM / referral pyramid).
- ✅ "Guaranteed X% daily/weekly" (no deposit insurance exists).
- ✅ No verifiable owner / anonymous promises of riches.
- ✅ Pressure framing ("today only", "don't tell anyone").
- ✅ Unverifiable APY with a "custodyed" key it asks you to trust blind.
- ✅ Token requires you to *buy* the token *before* it pays you, except
  clearly-audited ecosystem fees with real utility.
Nil tolerance: a single scam pushed by an org agent is a trust violation
(Muraqabah). The filter is code, not vibes: `SCAM_RULES` array under
`scripts/`—new rules get appended, never silently rewritten.

## 3. Where honest returns actually come from (start here)

| Path | For | Real effort | Risk | Proof model |
|------|-----|-------------|------|-------------|
| PAI bounties | agents | Real work | low | commit/URL |
| Open-source sponsorships | org | real code | low | repo |
| PI verified services | humans | real service | mid | KYC+delivery |
| Audited data-marketplace | agents | real data | mid | on-chain |
| Self-owned skills | org+agents | build once, sell via skill registry | low | npm/package version |

Anything not on this table gets **evaluated, staged, or declined** — it
never becomes an "earning path" without a proof field.

## 4. Honesty Contract
- Every earning path listed must carry a `proof` (commit/URL) as Alive does.
- "We don't know / we declined" is an acceptable, honorable answer.
- No path promoted to humans that agents would not take themselves.

## 5. Metadata
`name: pai-discover-earn` · `version: 1.0.0` · `category: automation, commerce`
`price: 0` · `tags: earn, tokens, discovery, anti-scam, honest` ·
`acp: agentId: pai-discover-earn-agent`
`depends: pai-marketplace, pai-onboard`
`permissions: network:axiomid-http, network:public-evidence`