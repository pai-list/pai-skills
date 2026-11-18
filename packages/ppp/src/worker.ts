// ppp.axiomid.app — PAI Protocol (PPP) USB-like Universal Agent Connector
// Plug-and-Play Wire Format & Interactive Universe Node Graph

const SERVER_NAME = "pai-ppp-connector";
const VERSION = "1.0.0";

const UNIVERSE_NODES = [
  { id: "pai_memory", uri: "pai://memory", name: "PAI 7-Layer Memory", status: "PLUGGED", type: "Storage & Context", color: "#38bdf8" },
  { id: "pai_aip", uri: "pai://aip", name: "AIP Identity Vault", status: "PLUGGED", type: "Security & Tokens", color: "#a855f7" },
  { id: "pai_pi_pay", uri: "pai://buy", name: "Pi Network Escrow", status: "PLUGGED", type: "Payments & Labor", color: "#fbbf24" },
  { id: "pai_mcp", uri: "pai://mcp", name: "MCP Gateway Tools", status: "PLUGGED", type: "Tool Execution", color: "#2dd4bf" },
  { id: "pai_runtime", uri: "pai://bye", name: "Agent Runtime Core", status: "PLUGGED", type: "Orchestration", color: "#f43f5e" },
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const PAGE_HTML = `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>PPP — Universal USB Connector for Agentic Universe (ppp.axiomid.app)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-base: #020617;
    --bg-card: rgba(15, 23, 42, 0.8);
    --border-glass: rgba(255, 255, 255, 0.08);
    --border-glass-hover: rgba(45, 212, 191, 0.4);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent-usb: #2dd4bf;
    --accent-purple: #c084fc;
    --accent-gold: #fbbf24;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'Fira Code', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg-base);
    background-image: 
      radial-gradient(circle at 50% 30%, rgba(45, 212, 191, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.06) 0%, transparent 50%),
      linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
    color: var(--text-primary);
    font-family: var(--font-sans);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    border-bottom: 1px solid var(--border-glass);
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(16px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 800;
    font-size: 1.25rem;
  }

  .brand-badge {
    padding: 0.25rem 0.65rem;
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.3);
    border-radius: 9999px;
    color: var(--accent-usb);
    font-size: 0.7rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
  }

  .lang-btn {
    background: transparent;
    border: 1px solid var(--border-glass);
    color: var(--text-secondary);
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-family: var(--font-mono);
    cursor: pointer;
    transition: all 0.2s;
  }

  .lang-btn:hover {
    border-color: var(--accent-usb);
    color: var(--accent-usb);
  }

  main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 900px) {
    .hero-grid { grid-template-columns: 1.2fr 0.8fr; }
  }

  .hero-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-usb), var(--accent-purple), var(--accent-gold));
  }

  .hero-title {
    font-size: clamp(2rem, 3.5vw, 2.75rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #ffffff 40%, var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  .console-card {
    background: #010409;
    border: 1px solid var(--border-glass);
    border-radius: 1.25rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-family: var(--font-mono);
  }

  .code-block {
    background: #0d1117;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    padding: 0.85rem;
    font-size: 0.72rem;
    color: #e6edf3;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  .universe-graph {
    background: #010409;
    border: 1px solid var(--border-glass);
    border-radius: 1.5rem;
    padding: 2rem;
    position: relative;
  }

  svg.node-canvas {
    width: 100%;
    height: 400px;
  }

  .usb-plug {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .usb-plug:hover circle {
    stroke-width: 3.5;
    filter: drop-shadow(0 0 12px var(--accent-usb));
  }

  footer {
    border-top: 1px solid var(--border-glass);
    padding: 2rem 1.5rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-family: var(--font-mono);
  }
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <a href="/" class="brand-logo">
      <span>PPP Universal Connector</span>
      <span class="brand-badge">ppp.axiomid.app</span>
    </a>
    <button class="lang-btn" id="lang-toggle" onclick="toggleLanguage()">AR / العربية</button>
  </div>
</header>

<main>
  <div class="hero-grid">
    <section class="hero-card">
      <h1 class="hero-title" id="hero-title">USB-Like Universal Connector</h1>
      <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;" id="hero-desc">
        Plug into any platform, motor, tool, or memory layer across the Agentic Universe. PPP (.ppp) is the verifiable request-response wire format for agent-to-agent communication.
      </p>
      <div style="display: flex; gap: 0.75rem;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(45, 212, 191, 0.1); color: var(--accent-usb); padding: 0.35rem 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(45, 212, 191, 0.3);">PLUG & PLAY</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(192, 132, 252, 0.1); color: var(--accent-purple); padding: 0.35rem 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(192, 132, 252, 0.3);">TRUSTCHAIN RECEIPTS</span>
      </div>
    </section>

    <section class="console-card">
      <div style="display: flex; justify-content: space-between; align-items: center; border-b: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--accent-usb);" id="console-label">⚡ Live .ppp Wire Packet</span>
        <span style="font-size: 0.68rem; color: var(--accent-gold);">VERIFIABLE RECEIPT</span>
      </div>
      <div class="code-block" id="ppp-packet-output">.ppp
Header: { "proto": "ppp/1.0", "endpoint": "pai://memory", "from": "did:axiom:pi:agent_01" }
---
Body: { "type": "memory.recall", "query": "Retrieve Pi Escrow state" }
---
Receipt: { "digest": "sha256:77a1b2c3...", "signer": "did:axiom:pi:agent_01" }</div>
    </section>
  </div>

  <section class="universe-graph">
    <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--accent-usb);" id="graph-heading">🔌 Universe USB Node Connectors (Click to Plug In)</h2>
    <svg class="node-canvas" viewBox="0 0 900 400" id="node-canvas"></svg>
  </section>
</main>

<footer>
  <p id="footer-text">ppp.axiomid.app · PAI Universe Universal Connector · Built with Ihsan</p>
</footer>

<script>
const nodes = ${JSON.stringify(UNIVERSE_NODES)};
let currentLang = 'en';

const i18n = {
  en: {
    heroTitle: "USB-Like Universal Connector",
    heroDesc: "Plug into any platform, motor, tool, or memory layer across the Agentic Universe. PPP (.ppp) is the verifiable request-response wire format for agent-to-agent communication.",
    consoleLabel: "⚡ Live .ppp Wire Packet",
    graphHeading: "🔌 Universe USB Node Connectors (Click to Plug In)",
    footerText: "ppp.axiomid.app · PAI Universe Universal Connector · Built with Ihsan"
  },
  ar: {
    heroTitle: "الموصل العام الشبيه بـ USB لمنظومة الوكلاء",
    heroDesc: "قم بالربط المباشر مع أي منصة أو محرك أو أداة أو طبقة ذاكرة عبر شبكة الوكلاء. يُعتبر PPP (.ppp) بروتوكول الرسائل المشفر والقابل للتحقق بين وكلاء الذكاء الاصطناعي.",
    consoleLabel: "⚡ حزمة بيانات .ppp الحية",
    graphHeading: "🔌 منافذ التوصيل المباشر بالمنظومة (انقر للتوصيل)",
    footerText: "ppp.axiomid.app · الموصل العام لمنظومة PAI Universe · بنيت بإحسان"
  }
};

function renderGraph() {
  const svg = document.getElementById('node-canvas');
  const cx = 450, cy = 200;
  let html = \`
    <g transform="translate(\${cx}, \${cy})">
      <circle r="55" fill="rgba(45, 212, 191, 0.15)" stroke="var(--accent-usb)" stroke-width="3" />
      <text text-anchor="middle" dy="-5" fill="#ffffff" font-family="var(--font-mono)" font-size="12" font-weight="800">PAI HUB</text>
      <text text-anchor="middle" dy="15" fill="var(--accent-usb)" font-family="var(--font-mono)" font-size="9">UNIVERSE</text>
    </g>
  \`;

  const radius = 140;
  nodes.forEach((n, idx) => {
    const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
    const nx = cx + radius * Math.cos(angle);
    const ny = cy + radius * Math.sin(angle);

    html += \`
      <line x1="\${cx}" y1="\${cy}" x2="\${nx}" y2="\${ny}" stroke="\${n.color}" stroke-width="2" stroke-dasharray="6" />
      <g class="usb-plug" transform="translate(\${nx}, \${ny})" onclick="plugNode('\${n.id}', '\${n.uri}')">
        <circle r="36" fill="#090d16" stroke="\${n.color}" stroke-width="2.5" />
        <text text-anchor="middle" dy="-5" fill="#ffffff" font-family="var(--font-mono)" font-size="9" font-weight="700">\${n.name}</text>
        <text text-anchor="middle" dy="12" fill="\${n.color}" font-family="var(--font-mono)" font-size="8">⚡ \${n.status}</text>
      </g>
    \`;
  });

  svg.innerHTML = html;
}

function plugNode(id, uri) {
  const output = document.getElementById('ppp-packet-output');
  output.textContent = \`.ppp
Header: { "proto": "ppp/1.0", "endpoint": "\${uri}", "from": "did:axiom:pi:agent_01", "ts": "\${new Date().toISOString()}" }
---
Body: { "type": "plug.connect", "target": "\${id}", "status": "PLUGGED_AND_VERIFIED" }
---
Receipt: { "digest": "sha256:\${Math.random().toString(16).slice(2)}", "signer": "did:axiom:pi:agent_01" }\`;
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-toggle').textContent = currentLang === 'en' ? 'AR / العربية' : 'EN / English';
  const t = i18n[currentLang];
  document.getElementById('hero-title').textContent = t.heroTitle;
  document.getElementById('hero-desc').textContent = t.heroDesc;
  document.getElementById('console-label').textContent = t.consoleLabel;
  document.getElementById('graph-heading').textContent = t.graphHeading;
  document.getElementById('footer-text').textContent = t.footerText;
}

renderGraph();
</script>
</body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ name: SERVER_NAME, version: VERSION, status: "live" });
    }

    if (url.pathname === "/" || url.pathname === "/console") {
      return new Response(PAGE_HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (url.pathname === "/v1/nodes") {
      return json({ nodes: UNIVERSE_NODES });
    }

    if (url.pathname === "/v1/ppp/pack" && request.method === "POST") {
      const body = await request.json().catch(() => ({})) as any;
      const endpoint = body.endpoint || "pai://bye";
      const pppDoc = `.ppp\nHeader: ${JSON.stringify({ proto: "ppp/1.0", endpoint, from: body.fromDid || "did:axiom:pi:agent" })}\n---\nBody: ${JSON.stringify(body.payload || {})}\n---\nReceipt: ${JSON.stringify({ digest: "sha256:" + crypto.randomUUID().replace(/-/g, ""), signer: body.fromDid || "did:axiom:pi:agent" })}`;
      return new Response(pppDoc, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new Response("not found", { status: 404 });
  },
};

function json(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
