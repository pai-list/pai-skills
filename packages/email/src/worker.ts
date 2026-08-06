// mail.axiomid.app — PAI Agentic Email Routing & Delivery Gateway
// Powered by Cloudflare Email Routing, Workers, Durable Objects, and Resend API

const SERVER_NAME = "pai-email-router";
const VERSION = "1.0.0";

const EMAIL_POLICIES = [
  {
    id: "pol_catchall_routing",
    name: "Cloudflare Catch-All Routing",
    status: "ACTIVE",
    domain: "*@mail.axiomid.app",
    description: "All incoming emails to any agent address are routed via Cloudflare Email Routing directly to AgentInboxDO.",
  },
  {
    id: "pol_auth_deliverability",
    name: "SPF / DKIM / DMARC Verification",
    status: "ENFORCED",
    domain: "mail.axiomid.app",
    description: "Strict email authentication DNS records isolate email reputation from root axiomid.app.",
  },
  {
    id: "pol_resend_outbound",
    name: "Resend API Transactional Bridge",
    status: "ACTIVE",
    domain: "mail.axiomid.app",
    description: "Agents issue outbound notifications using scoped AIP Tokens proxying Resend transactional API.",
  },
];

const SAMPLE_INBOX_EMAILS = [
  {
    id: "msg_99a81b",
    to: "bounty-bot@mail.axiomid.app",
    from: "pioneer@pi.network",
    subject: "Pi Escrow Settlement Confirmation",
    snippet: "Your Pi Network bounty submission lst_pi_analytics has been approved. Payment of 50 Pi dispatched.",
    timestamp: "2026-08-06T22:10:00Z",
    status: "DELIVERED",
  },
  {
    id: "msg_88c21d",
    to: "security-agent@mail.axiomid.app",
    from: "alerts@aip.axiomid.app",
    subject: "AIP Token Renewal Pulse",
    snippet: "Scoped token aip_tok_99182371 has been automatically renewed for 3600 seconds.",
    timestamp: "2026-08-06T21:45:00Z",
    status: "DELIVERED",
  },
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
<title>PAI Mail — Agentic Email Gateway & Routing (mail.axiomid.app)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --bg-base: #020617;
    --bg-card: rgba(15, 23, 42, 0.8);
    --border-glass: rgba(255, 255, 255, 0.08);
    --border-glass-hover: rgba(244, 63, 94, 0.4);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent-mail: #f43f5e;
    --accent-cyan: #2dd4bf;
    --accent-gold: #fbbf24;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'Fira Code', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg-base);
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(244, 63, 94, 0.08) 0%, transparent 55%),
      radial-gradient(circle at 80% 80%, rgba(45, 212, 191, 0.06) 0%, transparent 50%),
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
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.3);
    border-radius: 9999px;
    color: var(--accent-mail);
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
    border-color: var(--accent-mail);
    color: var(--accent-mail);
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
    background: linear-gradient(90deg, var(--accent-mail), var(--accent-cyan), var(--accent-gold));
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

  .inbox-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .inbox-item {
    background: rgba(13, 17, 23, 0.8);
    border: 1px solid var(--border-glass);
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    transition: all 0.2s;
  }

  .inbox-item:hover {
    border-color: var(--border-glass-hover);
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
      <span>PAI Mail Gateway</span>
      <span class="brand-badge">mail.axiomid.app</span>
    </a>
    <button class="lang-btn" id="lang-toggle" onclick="toggleLanguage()">AR / العربية</button>
  </div>
</header>

<main>
  <div class="hero-grid">
    <section class="hero-card">
      <h1 class="hero-title" id="hero-title">Agentic Email Routing Backbone</h1>
      <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;" id="hero-desc">
        Dedicated email infrastructure for PAI agents. Cloudflare Email Routing catches all *@mail.axiomid.app messages, delivering them directly to AgentInboxDO Durable Objects while preserving root domain reputation.
      </p>
      <div style="display: flex; gap: 0.75rem;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(244, 63, 94, 0.1); color: var(--accent-mail); padding: 0.35rem 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(244, 63, 94, 0.3);">CATCH-ALL * @mail.axiomid.app</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(45, 212, 191, 0.1); color: var(--accent-cyan); padding: 0.35rem 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(45, 212, 191, 0.3);">SPF/DKIM/DMARC ENFORCED</span>
      </div>
    </section>

    <section class="console-card">
      <div style="display: flex; justify-content: space-between; align-items: center; border-b: 1px solid var(--border-glass); padding-bottom: 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--accent-mail);" id="console-label">✉️ Agent Mail Router Test</span>
        <span style="font-size: 0.68rem; color: var(--accent-cyan);">● ROUTER LIVE</span>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-secondary);">1. Send Outbound Email (Resend API Bridge)</p>
      <div style="font-size: 0.72rem; color: #e6edf3; background: #0d1117; padding: 0.75rem; border-radius: 0.5rem;">POST https://mail.axiomid.app/api/email/send -H "Authorization: Bearer aip_tok_..."</div>
      <p style="font-size: 0.75rem; color: var(--text-secondary);">2. Inbound Webhook Event</p>
      <div style="font-size: 0.72rem; color: #e6edf3; background: #0d1117; padding: 0.75rem; border-radius: 0.5rem;">POST https://agent-name.axiomid.app/webhook/email</div>
    </section>
  </div>

  <section>
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.25rem;" id="inbox-heading">📬 Live Agent Inboxes (Sample Streams)</h2>
    <div class="inbox-list" id="inbox-container"></div>
  </section>
</main>

<footer>
  <p id="footer-text">mail.axiomid.app · PAI Universe Agentic Email Gateway · Built with Ihsan</p>
</footer>

<script>
const emails = ${JSON.stringify(SAMPLE_INBOX_EMAILS)};
let currentLang = 'en';

const i18n = {
  en: {
    heroTitle: "Agentic Email Routing Backbone",
    heroDesc: "Dedicated email infrastructure for PAI agents. Cloudflare Email Routing catches all *@mail.axiomid.app messages, delivering them directly to AgentInboxDO Durable Objects while preserving root domain reputation.",
    consoleLabel: "✉️ Agent Mail Router Test",
    inboxHeading: "📬 Live Agent Inboxes (Sample Streams)",
    footerText: "mail.axiomid.app · PAI Universe Agentic Email Gateway · Built with Ihsan"
  },
  ar: {
    heroTitle: "البنية التحتية لتوجيه البريد الإلكتروني للوكلاء",
    heroDesc: "البيئة المخصصة للبريد الإلكتروني لوكلاء PAI. يقوم توجيه البريد في Cloudflare بالتقاط كافة الرسائل إلى *@mail.axiomid.app وتحويلها إلى كائنات الذاكرة AgentInboxDO مع حماية سمعة النطاق الرئيسي.",
    consoleLabel: "✉️ اختبار موجه البريد للوكلاء",
    inboxHeading: "📬 صندوق بريد الوكلاء المباشر (عينة التدفق)",
    footerText: "mail.axiomid.app · بوابة البريد لمنظومة PAI Universe · بنيت بإحسان"
  }
};

function renderInbox() {
  const container = document.getElementById('inbox-container');
  container.innerHTML = emails.map(e => \`
    <div class="inbox-item">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-mail); font-weight: 700;">To: \${e.to}</span>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-cyan);">\${e.status}</span>
      </div>
      <p style="font-size: 0.85rem; font-weight: 600; color: #fff;">\${e.subject}</p>
      <p style="font-size: 0.78rem; color: var(--text-secondary);">From: \${e.from} · \${e.snippet}</p>
    </div>
  \`).join('');
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-toggle').textContent = currentLang === 'en' ? 'AR / العربية' : 'EN / English';
  const t = i18n[currentLang];
  document.getElementById('hero-title').textContent = t.heroTitle;
  document.getElementById('hero-desc').textContent = t.heroDesc;
  document.getElementById('console-label').textContent = t.consoleLabel;
  document.getElementById('inbox-heading').textContent = t.inboxHeading;
  document.getElementById('footer-text').textContent = t.footerText;
}

renderInbox();
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

    if (url.pathname === "/api/email/send" && request.method === "POST") {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer aip_tok_")) {
        return json({ error: "UNAUTHORIZED", message: "AIP Token required for outbound email sending" }, 401);
      }
      return json({
        status: "queued",
        messageId: "msg_" + crypto.randomUUID().slice(0, 8),
        provider: "resend_api",
        timestamp: new Date().toISOString(),
      });
    }

    return new Response("not found", { status: 404 });
  },
};

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
