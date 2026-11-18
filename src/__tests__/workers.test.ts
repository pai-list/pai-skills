import { afterEach, describe, expect, it, vi } from 'vitest';
import earnWorker from '../../packages/earn/src/worker';
import aipWorker from '../../packages/aip/src/worker';
import emailWorker from '../../packages/email/src/worker';

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
  };
}

describe('Muraqabah-compliant infrastructure workers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('earn worker returns 503 when EARN_KV is unbound, and persists registration/heartbeat/submission when bound', async () => {
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
    expect(kv.store.has(`submission:${subData.submissionId}`)).toBe(true);
  });

  it('aip worker issues HMAC-signed tokens, rejects forged prefixes, and proxies safely to upstream', async () => {
    const secret = 'test-signing-secret-32-chars-min';
    const upstream = 'https://upstream.internal';

    const unconfigured = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/tokens/issue', { method: 'POST', body: '{}' }),
    );
    expect(unconfigured.status).toBe(503);

    const issueRes = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/tokens/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentDid: 'did:axiom:pi:demo', scopes: ['intent:compile', 'email:send'] }),
      }),
      { AIP_SIGNING_SECRET: secret, UPSTREAM_URL: upstream },
    );
    expect(issueRes.status).toBe(200);
    const { tokenId } = await issueRes.json() as { tokenId: string };

    const forgedRes = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/proxy/execute', {
        method: 'POST',
        headers: { Authorization: 'Bearer aip_tok_forged.sig' },
        body: JSON.stringify({ path: '/v1/ping' }),
      }),
      { AIP_SIGNING_SECRET: secret, UPSTREAM_URL: upstream },
    );
    expect(forgedRes.status).toBe(401);

    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);

    const execRes = await aipWorker.fetch(
      new Request('https://aip.axiomid.app/v1/proxy/execute', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/v1/ping', method: 'POST', payload: { hello: 'world' } }),
      }),
      { AIP_SIGNING_SECRET: secret, UPSTREAM_URL: upstream },
    );
    expect(execRes.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://upstream.internal/v1/ping');

    // Verify email worker validates signed token + Resend config
    const noEmailCfg = await emailWorker.fetch(
      new Request('https://mail.axiomid.app/api/email/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenId}` },
        body: JSON.stringify({ to: 'a@b.c', subject: 'hi', text: 'hello' }),
      }),
    );
    expect(noEmailCfg.status).toBe(503);

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
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[1][0]).toBe('https://api.resend.com/emails');
  });
});
