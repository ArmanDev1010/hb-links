// Posts a lead into a RingCentral chat via an Incoming Webhook (RingCentral app
// → the chat → Add Apps → Incoming Webhook). The webhook URL is the only
// credential — anyone holding it can post to that chat — so it lives in a
// server-side env var, never in the code or a NEXT_PUBLIC_ variable:
//
//   RINGCENTRAL_WEBHOOK_URL=https://hooks.ringcentral.com/webhook/v2/...

const TIMEOUT_MS = 8000;

export function isRingCentralConfigured() {
  return Boolean(process.env.RINGCENTRAL_WEBHOOK_URL);
}

// Throws if the chat didn't accept the post. The error carries RingCentral's
// response, never the URL.
export async function sendRingCentralMessage(text) {
  const res = await fetch(process.env.RINGCENTRAL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`RingCentral responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}
