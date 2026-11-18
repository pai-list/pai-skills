#!/usr/bin/env node
// Honest earning-path filter for pai-discover-earn.
// Pure stdlib. Every candidate path must pass ALL checks to be published.
// exit 0 = safe/honest, non-zero = blocked (with the rule that caught it).
const SCAM_RULES = [
  { id: "pay-to-earn", rx: /(pay.*to.*earn|entry fee|deposit to)|must.*(pay|invest).*(first|before)/i },
  { id: "referral-mlm", rx: /(multi.level|pyramid|recruit.*paid|earn.*referr|invite.*and.*earn)/i },
  { id: "guaranteed", rx: /guarantee|no risk|risk.free|ensure.*(daily|weekly).*%|fixed \d+%/i },
  { id: "unrealistic", rx: /\d{2,}%\s*(daily|weekly)|double.*(week|day)|10x|100x/i },
  { id: "pressure", rx: /(only|limited).*today|act now|don't tell anyone|refer.*48h/i },
  { id: "no-proof", rx: /(no audited?|no docs|no url|unverified)/i },
  { id: "anon-riches", rx: /(anonymous?|fake).*riches|instant wealth|guaranteed profits/i },
  { id: "hold-to-earn", rx: /stake.*to.*earn|airdrop.*per.*(hold|retain)|buy now.*rewards/i },
];

const STRONG_PROOF = [
  "https://", "commit/", "sha256:", "official.json", "@pai/",
];

export function scan(path) {
  const text = typeof path === "string" ? path : `${path.effort || ""} ${path.risk || ""} ${path.promise || ""} ${path.channel || ""}`;
  const hits = SCAM_RULES.filter((r) => r.rx.test(text)).map((r) => r.id);
  return { safe: hits.length === 0, blockedBy: hits };
}

export function hasProof(path) {
  const s = typeof path === "string" ? path : JSON.stringify(path);
  return STRONG_PROOF.some((p) => s.includes(p));
}

export function evaluate(path) {
  const { safe, blockedBy } = scan(path);
  if (!safe) return { status: "blocked", reasons: blockedBy };
  if (!hasProof(path)) return { status: "declined-no-proof", reasons: ["missing-proof"] };
  return { status: "listed", reasons: [] };
}

if (process.argv[1] === import.meta.filename) {
  const good = evaluate("earn PI bounty for fixing an open issue: github.com/pai-list/protocol-stubs https://github.com/pai-list/tree/hash  commit/abc1234");
  const scam = evaluate("Guaranteed 50% daily passive income, pay to enter https://anon... 100x today only !");
  const noProof = evaluate("audited stablecoin yield via community fund — claimed on a forum without links");
  if (good.status !== "listed") { console.error("self-check FAIL good path:", good); process.exit(1); }
  if (scam.status === "safe" || scam.status === "listed") { console.error("self-check FAIL SCAM passed:", scam); process.exit(1); }
  if (noProof.status !== "declined-no-proof") { console.error("self-check FAIL no-proof:", noProof); process.exit(1); }
  console.log("self-check OK · good=listed · scam=blocked · noproof=declined · rules:", SCAM_RULES.length);
}