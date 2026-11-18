import { afterEach, describe, expect, it, vi } from 'vitest';
import earnWorker from '../../packages/earn/src/worker';
import aipWorker from '../../packages/aip/src/worker';
import emailWorker from '../../packages/email/src/worker';
import skillsServerWorker from '../../packages/server/src/worker';

function createMemoryKv() {
  const store = new Map<string, string>();
  return {
    store,
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list({ prefix = '' }: { prefix?: string } = {}) {
      const keys = Array.from(store.keys())
        .filter(k => k.startsWith(prefix))
        .map(name => ({ name }));
      return { keys, list_complete: true, cacheStatus: null };
    },
  };
}

describe('Muraqabah-compliant infrastructure workers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('earn worker returns 503 when EARN_KV is unbound, and persists full-UUID registration/heartbeat/submission when bound', async () => {
    const noKvRes = await earnWorker.fetch(
      new Request('https://earn.axiomid.app/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test-agent' }),
      }),
    );
    expect(noKvRes.status).toBe(503);

    const kv = createMemoryKv();
    const regRes = await earnWorker.fetch(
      new Request('https://earn.axiomid.app/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test-agent' }),
      }),
      { EARN_KV: kv },
    );
    expect(regRes.status).toBe(201);
    const regData = await regRes.json() as { agentId: string; apiKey: string };
    expect(regData.agentId.length).toBeGreaterThan(20);
    expect(regData.apiKey.startsWith('sk_pai_')).toBe(true);

    const badHb = await earnWorker.fetch(
      new Request('https://earn.axiomid.app/api/agents/heartbeat', {
        method: 'POST',
        headers: { Authorization: 'Bearer sk_pai_forged' },
      }),
      { EARN_KV: kv },
    );
    expect(badHb.status).toBe(401);

    const goodHb = await earnWorker.fetch(
      new Request('https://earn.axiomid.app/api/agents/heartbeat', {
        method: 'POST',
        headers: { Authorization: `Bearer ${regData.apiKey}` },
      }),
      { EARN_KV: kv },
    );
    expect(goodHb.status).toBe(200);

    const subRes = await earnWorker.fetch(
      new Request('https://earn.axiomid.app/api/agents/submissions/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${regData.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId: 'lst_pi_ledger_parser', summary: 'Implemented parser' }),
      }),
      { EARN_KV: kv },
    );
    expect(subRes.status).toBe(201);
    const subData = await subRes.json() as { submissionId: string; status: string };
    expect(subData.status).toBe('submitted');
    expect(subData.submissionId.length).toBeGreaterThan(20);
    expect(kv.store.has(`submission:${subData.submissionId}`)).toBe(true);
  });

  it('aip worker requires issuer auth, verifies HMAC tokens, relays bodyless 204 responses, and backs email worker', async () => {
    const secret = 'test-signing-secret-32-chars-min';
    const issuerKey = 'issuer-admin-secret-key';
    const upstream = 'https://upstream.internal';

    const unconfigured = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/tokens/issue', { method: 'POST', body: '{}' }),
    );
    expect(unconfigured.status).toBe(503);

    const unauthIssue = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/tokens/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentDid: 'did:axiom:pi:victim' }),
      }),
      { AIP_SIGNING_SECRET: secret, AIP_ISSUER_KEY: issuerKey, UPSTREAM_URL: upstream },
    );
    expect(unauthIssue.status).toBe(401);

    const issueRes = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/tokens/issue', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${issuerKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentDid: 'did:axiom:pi:demo', scopes: ['intent:compile', 'email:send'] }),
      }),
      { AIP_SIGNING_SECRET: secret, AIP_ISSUER_KEY: issuerKey, UPSTREAM_URL: upstream },
    );
    expect(issueRes.status).toBe(200);
    const { tokenId } = await issueRes.json() as { tokenId: string };

    const forgedRes = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/proxy/execute', {
        method: 'POST',
        headers: { Authorization: 'Bearer aip_tok_forged.sig' },
        body: JSON.stringify({ path: '/v1/ping' }),
      }),
      { AIP_SIGNING_SECRET: secret, AIP_ISSUER_KEY: issuerKey, UPSTREAM_URL: upstream },
    );
    expect(forgedRes.status).toBe(401);

    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 're_msg_1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);

    const exec204 = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/proxy/execute', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/v1/ack', method: 'POST', payload: { ok: true } }),
      }),
      { AIP_SIGNING_SECRET: secret, AIP_ISSUER_KEY: issuerKey, UPSTREAM_URL: upstream },
    );
    expect(exec204.status).toBe(204);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://upstream.internal/v1/ack');

    const sentRes = await emailWorker.fetch(
      new Request('https://mail.axiomid.app/api/email/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: 'pioneer@pi.network', subject: 'Welcome', text: 'Hello!' }),
      }),
      { RESEND_API_KEY: 're_test_key', AIP_SIGNING_SECRET: secret },
    );
    expect(sentRes.status).toBe(200);
    expect(fetchSpy.mock.calls[1][0]).toBe('https://api.resend.com/emails');
  });

  it('skills server exposes valid MCP inputSchema, enforces Bearer auth, isolates KV keys, and serves valid HTML script', async () => {
    const kv = createMemoryKv();
    const env = { MEMORY: kv as unknown as KVNamespace, MCP_AUTH_TOKEN: 'mcp-secret-token' };

    const htmlRes = await skillsServerWorker.fetch(new Request('https://skills.axiomid.app/'), env);
    const htmlText = await htmlRes.text();
    expect(htmlText).not.toContain('Record<string, string>');
    expect(htmlText).toContain("getElementById('pi-skills-heading')");
    expect(htmlText).not.toContain("getElementById('skills-heading')");

    const listRes = await skillsServerWorker.fetch(
      new Request('https://skills.axiomid.app/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      }),
      env,
    );
    const listData = await listRes.json() as { result: { tools: Array<{ name: string; inputSchema?: Record<string, unknown> }> } };
    const memTool = listData.result.tools.find(t => t.name === 'pi_agent_memory');
    expect(memTool?.inputSchema).toBeDefined();
    expect((memTool?.inputSchema as { properties?: Record<string, unknown> })?.properties).toHaveProperty('action');

    const unauthCall = await skillsServerWorker.fetch(
      new Request('https://skills.axiomid.app/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: { name: 'pi_agent_memory', arguments: { action: 'store', layer: 'mem7', key: 'k', value: 'v' } },
        }),
      }),
      env,
    );
    expect(unauthCall.status).toBe(401);

    const storeA = await skillsServerWorker.fetch(
      new Request('https://skills.axiomid.app/mcp', {
        method: 'POST',
        headers: { Authorization: 'Bearer mcp-secret-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: { name: 'pi_agent_memory', arguments: { action: 'store', layer: 'mem7', key: 'user:intent', value: 'A' } },
        }),
      }),
      env,
    );
    expect(storeA.status).toBe(200);
    const storeAData = await storeA.json() as { result: { content: Array<{ type: string; text: string }>; stored: string } };
    expect(storeAData.result.content[0].type).toBe('text');

    const storeB = await skillsServerWorker.fetch(
      new Request('https://skills.axiomid.app/mcp', {
        method: 'POST',
        headers: { Authorization: 'Bearer mcp-secret-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 4,
          method: 'tools/call',
          params: { name: 'pi_agent_memory', arguments: { action: 'store', layer: 'mem7:user', key: 'intent', value: 'B' } },
        }),
      }),
      env,
    );
    const storeBData = await storeB.json() as { result: { stored: string } };
    expect(storeBData.result.stored).not.toBe(storeAData.result.stored);
    expect(kv.store.size).toBe(2);
  });
});
