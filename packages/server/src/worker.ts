// skills.axiomid.app — The Standard Pi Network Agentic Skills Library & MCP Server
// PAI Universe SOUL Protocol & Impeccable Design Standard

const SERVER_NAME = "pi-skills-registry";
const VERSION = "1.0.0";

/** Security headers for iframe embedding from axiomid.app */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "ALLOW-FROM https://axiomid.app",
  "Content-Security-Policy": "frame-ancestors https://axiomid.app",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", ...SECURITY_HEADERS },
  });
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", ...SECURITY_HEADERS },
  });
}

const PI_NETWORK_SKILLS = [
  {
    id: "pi-wallet-autonomy",
    name: "pi_wallet_pay",
    category: "Finance & Payments",
    description: "Autonomous Pi Network token payments, escrow contracts, and automated bounty distribution for AI agents.",
    codeSnippet: `import { PiAgentWallet } from "@pai/sdk";

const wallet = new PiAgentWallet({ did: "did:axiom:agt_991" });
const tx = await wallet.pay({
  recipient: "GD5TJZNKPNFSSX...",
  amount: 3.14,
  memo: "Agentic task execution"
});`,
    mcpMethod: "tools/call:pi_wallet_pay",
  },
  {
    id: "pi-kyc-verifier",
    name: "pi_kyc_verify",
    category: "Identity & Verification",
    description: "Server-side Pi Network KYC/KYA validation linking Pi UIDs to W3C DIDs with 100% cryptographic proof.",
    codeSnippet: `import { verifyPiUser } from "@pai/identity";

const verifiedUser = await verifyPiUser({
  accessToken: req.headers.get("authorization"),
  requireKyc: true
});`,
    mcpMethod: "tools/call:pi_kyc_verify",
  },
  {
    id: "pi-mem7-persistence",
    name: "pi_agent_memory",
    category: "Memory & Context",
    description: "7-Layer mem7 context persistence engine allowing agents to store and recall historical vectors seamlessly.",
    codeSnippet: `import { PAI7LayerMemory } from "@pai/memory";

const memory = new PAI7LayerMemory();
await memory.store({ layer: "mem7", key: "user_intent", value: "book_flight" });
const context = await memory.recall("flight preference");`,
    mcpMethod: "tools/call:pi_agent_memory",
  },
  {
    id: "pi-labor-bounties",
    name: "pi_labor_bounty",
    category: "Labor & Marketplace",
    description: "Agentic marketplace task creation, bid placement, and automatic proof-of-work settlement in Pi tokens.",
    codeSnippet: `import { PAIEarnMarketplace } from "@pai/earn";

const job = await PAIEarnMarketplace.createJob({
  title: "Analyze Pi ledger transactions",
  rewardPi: 10,
  verifierDid: "did:axiom:oracle_1"
});`,
    mcpMethod: "tools/call:pi_labor_bounty",
  },
];

const AI_AGENTIC_SKILLS = [
  {
    id: "agent-frontend-dev",
    name: "agent_frontend_dev",
    category: "Engineering — Frontend",
    description: "React/Vue/Angular, UI implementation, performance — modern web apps, pixel-perfect UIs, Core Web Vitals optimization.",
    mcpMethod: "tools/call:agent_frontend_dev",
  },
  {
    id: "agent-backend-architect",
    name: "agent_backend_architect",
    category: "Engineering — Backend",
    description: "API design, database architecture, scalability — server-side systems, microservices, cloud infrastructure.",
    mcpMethod: "tools/call:agent_backend_architect",
  },
  {
    id: "agent-security-auditor",
    name: "agent_security_auditor",
    category: "Security",
    description: "Vulnerability assessment, code review, penetration testing — securing AI agents and infrastructure.",
    mcpMethod: "tools/call:agent_security_auditor",
  },
  {
    id: "agent-qa-engineer",
    name: "agent_qa_engineer",
    category: "Testing",
    description: "Automated testing, visual regression, API validation — breaking things so users don't have to.",
    mcpMethod: "tools/call:agent_qa_engineer",
  },
  {
    id: "agent-growth-hacker",
    name: "agent_growth_hacker",
    category: "Marketing",
    description: "Rapid user acquisition, viral loops, experiments — explosive growth, user acquisition, conversion optimization.",
    mcpMethod: "tools/call:agent_growth_hacker",
  },
  {
    id: "agent-sales-outbound",
    name: "agent_sales_outbound",
    category: "Sales",
    description: "Signal-based prospecting, multi-channel sequences, ICP targeting — building pipeline through research-driven outreach.",
    mcpMethod: "tools/call:agent_sales_outbound",
  },
];

const ALL_SKILLS = [...PI_NETWORK_SKILLS, ...AI_AGENTIC_SKILLS];

const MCP_SERVER_CONFIG = `{
  "mcpServers": {
    "pi-skills-mcp": {
      "command": "npx",
      "args": ["-y", "@pai/skills-mcp@latest"],
      "env": {
        "PI_SKILLS_ENDPOINT": "https://skills.axiomid.app/mcp"
      }
    }
  }
}`;

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
<title>Pi Network Agentic Skills Hub — skills.axiomid.app</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-base: #020617;
    --bg-card: rgba(15, 23, 42, 0.7);
    --border-glass: rgba(255, 255, 255, 0.08);
    --border-glass-hover: rgba(0, 255, 136, 0.35);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent-emerald: #00ff88;
    --accent-cyan: #00f0ff;
    --accent-purple: #a855f7;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'Fira Code', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg-base);
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(0, 255, 136, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(0, 240, 255, 0.08) 0%, transparent 40%),
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
    font-size: 1.2rem;
  }

  .brand-badge {
    padding: 0.25rem 0.65rem;
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 9999px;
    color: var(--accent-emerald);
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
    border-color: var(--accent-emerald);
    color: var(--accent-emerald);
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

  .hero-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    backdrop-filter: blur(20px);
    border-radius: 1.5rem;
    padding: 3rem 2.5rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan), var(--accent-purple));
  }

  .hero-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #ffffff 40%, var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  .hero-desc {
    color: var(--text-secondary);
    font-size: 1.05rem;
    max-width: 46rem;
    line-height: 1.6;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 900px) {
    .skills-grid { grid-template-columns: 1fr 1fr; }
  }

  .skill-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    backdrop-filter: blur(16px);
    border-radius: 1.25rem;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: all 0.25s ease;
  }

  .skill-card:hover {
    border-color: var(--border-glass-hover);
    box-shadow: 0 10px 30px -10px rgba(0, 255, 136, 0.15);
    transform: translateY(-2px);
  }

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .skill-name {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-emerald);
  }

  .skill-category {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);
    border: 1px solid var(--border-glass);
  }

  .code-box {
    background: #010409;
    border: 1px solid var(--border-glass);
    border-radius: 0.75rem;
    padding: 1rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: #e6edf3;
    overflow-x: auto;
    white-space: pre;
  }

  .mcp-box {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    backdrop-filter: blur(16px);
    border-radius: 1.25rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .copy-btn {
    background: linear-gradient(135deg, rgba(0, 255, 136, 0.15), rgba(0, 240, 255, 0.15));
    border: 1px solid var(--accent-emerald);
    color: var(--accent-emerald);
    padding: 0.85rem 1.5rem;
    border-radius: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
  }

  .copy-btn:hover {
    background: linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 240, 255, 0.3));
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
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
      <span>Pi Skills Standard</span>
      <span class="brand-badge">skills.axiomid.app</span>
    </a>
    <button class="lang-btn" id="lang-toggle" onclick="toggleLanguage()">AR / العربية</button>
  </div>
</header>

<main>
  <section class="hero-card">
    <h1 class="hero-title" id="hero-title">Pi Network Agentic Skills Registry</h1>
    <p class="hero-desc" id="hero-desc">
      The official open standard library for Pi Network AI agents. Equipped with native Pi payment autonomies, server-side KYC verification, mem7 7-layer memory, and a dedicated MCP Server.
    </p>
  </section>

  <section>
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;" id="pi-skills-heading">⚡ Pi Network Skills (4)</h2>
    <div class="skills-grid" id="pi-skills-container"></div>
  </section>

  <section>
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem; margin-top: 2.5rem;" id="ai-skills-heading">🤖 AI Agentic Skills (6)</h2>
    <div class="skills-grid" id="ai-skills-container"></div>
  </section>

  <section class="mcp-box">
    <h2 style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan);" id="mcp-title">🔌 Pi Network MCP Server Endpoint</h2>
    <p style="font-size: 0.85rem; color: var(--text-secondary);" id="mcp-desc">
      Connect your agent framework directly to the Pi Network MCP Server via <code>https://skills.axiomid.app/mcp</code>.
    </p>
    <pre class="code-box">${escapeHtml(MCP_SERVER_CONFIG)}</pre>
    <button class="copy-btn" id="copy-btn" onclick="copyMcpConfig()">📋 COPY PI MCP CONFIG</button>
  </section>
</main>

<footer>
  <p id="footer-text">skills.axiomid.app · PAI Universe Pi Agentic Standard · Built with Ihsan</p>
</footer>

<script>
const piNetworkSkills = ${JSON.stringify(PI_NETWORK_SKILLS)};
const aiAgenticSkills = ${JSON.stringify(AI_AGENTIC_SKILLS)};
let currentLang = 'en';

const i18n = {
  en: {
    heroTitle: "Pi Network Agentic Skills Registry",
    heroDesc: "The official open standard library for Pi Network AI agents. Equipped with native Pi payment autonomies, server-side KYC verification, mem7 7-layer memory, and a dedicated MCP Server.",
    piSkillsHeading: "⚡ Pi Network Skills (4)",
    aiSkillsHeading: "🤖 AI Agentic Skills (6)",
    mcpTitle: "🔌 Pi Network MCP Server Endpoint",
    mcpDesc: "Connect your agent framework directly to the Pi Network MCP Server via https://skills.axiomid.app/mcp.",
    copyBtn: "📋 COPY PI MCP CONFIG",
    copied: "COPIED ✓",
    footerText: "skills.axiomid.app · PAI Universe Pi Agentic Standard · Built with Ihsan"
  },
  ar: {
    heroTitle: "مكتبة مهارات الذكاء الاصطناعي لشبكة Pi Network",
    heroDesc: "المعيار القياسي المفتوح لمهارات وكلاء الذكاء الاصطناعي على شبكة Pi Network. مزودة بدفع الاستقلالية المالي، والتوثيق الخادمي للـ KYC، وذاكرة mem7، وسيرفر MCP مخصص.",
    piSkillsHeading: "⚡ مهارات شبكة Pi (4)",
    aiSkillsHeading: "🤖 مهارات الوكلاء الذكية (6)",
    mcpTitle: "🔌 سيرفر Pi Network MCP المباشر",
    mcpDesc: "اربط هيكلية عمل وكيلك مباشرة بسيرفر MCP عبر https://skills.axiomid.app/mcp.",
    copyBtn: "📋 نسخ إعدادات Pi MCP",
    copied: "تم النسخ بنجاح ✓",
    footerText: "skills.axiomid.app · معيار PAI Universe للذكاء الاصطناعي · بنيت بإحسان"
  },
  zh: {
    heroTitle: "Pi Network 代理技能注册表",
    heroDesc: "Pi Network AI 代理的官方开放标准库。配备原生 Pi 支付自主权、服务端 KYC 验证、mem7 七层记忆和专用 MCP 服务器。",
    piSkillsHeading: "⚡ Pi 网络技能 (4)",
    aiSkillsHeading: "🤖 AI 代理技能 (6)",
    mcpTitle: "🔌 Pi 网络 MCP 服务器端点",
    mcpDesc: "通过 https://skills.axiomid.app/mcp 将您的代理框架直接连接到 Pi 网络 MCP 服务器。",
    copyBtn: "📋 复制 PI MCP 配置",
    copied: "已复制 ✓",
    footerText: "skills.axiomid.app · PAI Universe Pi 代理标准 · 以 Ihsan 构建"
  },
  hi: {
    heroTitle: "Pi नेटवर्क एजेंट स्किल्स रजिस्ट्री",
    heroDesc: "Pi नेटवर्क AI एजेंटों के लिए आधिकारिक ओपन स्टैंडर्ड लाइब्रेरी। नेटिव Pi भुगतान स्वायत्त्त, सर्वर-साइड KYC सत्यापन, mem7 7-लेयर मेमोरी और एक समर्पित MCP सर्वर के साथ।",
    piSkillsHeading: "⚡ Pi नेटवर्क स्किल्स (4)",
    aiSkillsHeading: "🤖 AI एजेंटिक स्किल्स (6)",
    mcpTitle: "🔌 Pi नेटवर्क MCP सर्वर एंडपॉइंट",
    mcpDesc: "https://skills.axiomid.app/mcp के माध्यम से अपने एजेंट फ्रेमवर्क को सीधे Pi नेटवर्क MCP सर्वर से जोड़ें।",
    copyBtn: "📋 PI MCP कॉन्फिग कॉपी करें",
    copied: "कॉपी हो गया ✓",
    footerText: "skills.axiomid.app · PAI यूनिवर्स Pi एजेंटिक स्टैंडर्ड · Ihsan के साथ निर्मित"
  }
};

function renderSkills() {
  const piContainer = document.getElementById('pi-skills-container');
  const aiContainer = document.getElementById('ai-skills-container');
  
  piContainer.innerHTML = piNetworkSkills.map(s => \`
    <div class="skill-card">
      <div class="skill-header">
        <span class="skill-name">\${s.name}</span>
        <span class="skill-category">\${s.category}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">\${s.description}</p>
      \${s.codeSnippet ? \`<div class="code-box">\${s.codeSnippet}</div>\` : ''}
    </div>
  \`).join('');
  
  aiContainer.innerHTML = aiAgenticSkills.map(s => \`
    <div class="skill-card">
      <div class="skill-header">
        <span class="skill-name">\${s.name}</span>
        <span class="skill-category">\${s.category}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">\${s.description}</p>
    </div>
  \`).join('');
}

function copyMcpConfig() {
  const text = \`${MCP_SERVER_CONFIG}\`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = i18n[currentLang].copied;
    setTimeout(() => { btn.textContent = i18n[currentLang].copyBtn; }, 2000);
  });
}

function toggleLanguage() {
  const order: Record<string, string> = { en: 'ar', ar: 'zh', zh: 'hi', hi: 'en' };
  currentLang = order[currentLang] ?? 'en';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  const label: Record<string, string> = { en: 'العربية AR', ar: '中文 ZH', zh: 'हिंदी HI', hi: 'EN English' };
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = label[currentLang];
  const t = i18n[currentLang];
  document.getElementById('hero-title').textContent = t.heroTitle;
  document.getElementById('hero-desc').textContent = t.heroDesc;
  document.getElementById('skills-heading').textContent = t.skillsHeading;
  document.getElementById('mcp-title').textContent = t.mcpTitle;
  document.getElementById('mcp-desc').textContent = t.mcpDesc;
  document.getElementById('copy-btn').textContent = t.copyBtn;
  document.getElementById('footer-text').textContent = t.footerText;
}

renderSkills();
</script>
</body>
</html>`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return json({
        name: SERVER_NAME,
        version: VERSION,
        status: "live",
        endpoint: "https://skills.axiomid.app",
      });
    }
    if (url.pathname === "/" || url.pathname === "/console") {
      return html(PAGE_HTML);
    }
    if (url.pathname === "/mcp" || request.method === "POST") {
      const body = await request.json().catch(() => null);
      if (body && body.method === "tools/list") {
        return json({
          jsonrpc: "2.0",
          id: body.id ?? null,
          result: { tools: PI_SKILLS },
        });
      }
      return json({
        jsonrpc: "2.0",
        id: body?.id ?? null,
        result: { status: "success", server: "pi-skills-mcp", version: VERSION },
      });
    }
    return new Response("not found", { status: 404, headers: SECURITY_HEADERS });
  },
};
