// Text-message delivery for contact-form leads, via Twilio's REST API. Plain
// `fetch` — no SDK/dependency needed for a single "send one SMS" call.
//
// All configuration is read from server-side env vars (put them in .env.local
// and in the host's environment settings — never prefix them NEXT_PUBLIC_, or
// they'd ship to the browser):
//
//   TWILIO_ACCOUNT_SID              from the Twilio console
//   TWILIO_AUTH_TOKEN               from the Twilio console
//   TWILIO_FROM_NUMBER              a Twilio number that can send SMS, OR
//   TWILIO_MESSAGING_SERVICE_SID    a Messaging Service (use this instead of a
//                                   raw number once an A2P 10DLC campaign is
//                                   registered — US carriers require that)
//   SMS_TO_NUMBER                   the phone that should receive requests
//
// Numbers can be written any normal way — "(818) 303-3555", "818-303-3555",
// "+18183033555" — they're normalized to E.164 below.

// Twilio rejects bodies over 1600 chars; stay comfortably under it. The
// free-text field is capped separately so one long message can't balloon the
// segment count (each ~160-char segment is billed).
const MAX_SMS_LENGTH = 1500;
const DETAILS_MAX = 600;

// "(818) 303-3555" / "818-303-3555" / "1 818 303 3555" / "+44 20 7946 0958"
// → "+18183033555" / "+442079460958". Returns null if it isn't a usable
// number. A bare 10-digit number is assumed to be US/Canada (+1).
export function toE164(raw) {
  const value = String(raw ?? "").trim();
  const digits = value.replace(/\D/g, "");
  if (value.startsWith("+")) return digits.length >= 8 ? `+${digits}` : null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const collapse = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

// "Label: value", or null when there's nothing to show so the line is dropped.
const line = (label, value, max = 200) => {
  const text = truncate(collapse(value), max);
  return text ? `${label}: ${text}` : null;
};

// The plain-text summary of a request, used for both the SMS and the RingCentral
// chat post. Optional fields (email, address, project type, details) are left
// out entirely when blank rather than printing empty labels. The texts line
// sits right under the phone so truncation can't cut it: it's the team's
// record of whether this lead agreed to texts on the website (and when).
export function buildLeadText({
  name,
  phone,
  mail,
  address,
  service,
  message,
  smsConsentAt,
}) {
  return truncate(
    [
      "New HB Links request",
      line("Name", name, 100),
      line("Phone", phone, 40),
      smsConsentAt
        ? `Texts: OK — opted in on the website ${smsConsentAt}`
        : "Texts: not opted in on the website — ask before texting",
      line("Email", mail, 120),
      line("Address", address, 200),
      line("Project", service, 100),
      line("Details", message, DETAILS_MAX),
    ]
      .filter(Boolean)
      .join("\n"),
    MAX_SMS_LENGTH,
  );
}

// True only when every value needed to actually send is present — lets the
// caller fall back to another channel instead of failing while this is still
// being set up.
export function isSmsConfigured() {
  const env = process.env;
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
      env.TWILIO_AUTH_TOKEN &&
      (env.TWILIO_MESSAGING_SERVICE_SID || toE164(env.TWILIO_FROM_NUMBER)) &&
      toE164(env.SMS_TO_NUMBER),
  );
}

// Sends `body` to SMS_TO_NUMBER. Throws (with Twilio's error detail, never the
// credentials) if the message isn't accepted.
export async function sendSms(body) {
  const env = process.env;
  const sid = env.TWILIO_ACCOUNT_SID;

  const params = new URLSearchParams({
    To: toE164(env.SMS_TO_NUMBER),
    Body: body,
  });
  if (env.TWILIO_MESSAGING_SERVICE_SID) {
    params.set("MessagingServiceSid", env.TWILIO_MESSAGING_SERVICE_SID);
  } else {
    params.set("From", toE164(env.TWILIO_FROM_NUMBER));
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Twilio responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}
