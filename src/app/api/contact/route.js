import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildLeadText, isSmsConfigured, sendSms } from "@/lib/sms";
import {
  isRingCentralConfigured,
  sendRingCentralMessage,
} from "@/lib/ringcentral";

// Server-side secrets — from .env.local locally and the Vercel project's
// Environment Variables in production. Never hardcode them here: the repo is
// public, so anything in this file is readable by anyone.
//
//   EMAIL_USER         Gmail account the fallback email is sent from
//   EMAIL_PASS         that account's Gmail app password
//   RECEIVER_EMAIL     where the fallback email is delivered

const DEFAULT_RECEIVER = "info@hb-links.com";

// Form values go into the notification email's HTML, so they're escaped —
// otherwise a visitor could inject markup or links into the email.
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

// The time the visitor opted in to texts, in the office's time zone — the
// lead carries it as the record of consent (see SmsConsent).
const consentTimestamp = () =>
  `${new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  })} PT`;

export async function POST(req) {
  const body = await req.json();
  const { name, phone, mail, address, service, message, smsConsent, hb_check } = body;
  const smsConsentAt = smsConsent === true ? consentTimestamp() : null;

  // The form has no CAPTCHA, so two light spam checks instead: `hb_check` is
  // a field people never see (EstimateForm's DetailsStep) — only a bot fills
  // it, and it's told the send worked so it doesn't retry — and a request
  // without a name and a usable phone number is turned away.
  if (hb_check) {
    return NextResponse.json({ success: true });
  }
  if (!String(name ?? "").trim() || String(phone ?? "").replace(/\D/g, "").length < 7) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  // Requests are posted to the RingCentral chat and/or texted to SMS_TO_NUMBER,
  // whichever are configured. Email is the fallback when neither is set up or
  // every channel fails, so a lead is never dropped.
  const text = buildLeadText({ name, phone, mail, address, service, message, smsConsentAt });
  const channels = [
    { label: "RingCentral", enabled: isRingCentralConfigured(), send: () => sendRingCentralMessage(text) },
    { label: "SMS", enabled: isSmsConfigured(), send: () => sendSms(text) },
  ].filter((channel) => channel.enabled);

  if (channels.length) {
    const results = await Promise.allSettled(channels.map((channel) => channel.send()));
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`${channels[i].label} delivery failed:`, result.reason);
      }
    });
    if (results.some((result) => result.status === "fulfilled")) {
      return NextResponse.json({ success: true });
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const row = (label, value) =>
      `<p style="margin: 12px 0;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

    // Email is optional on the form, so only use it for reply-to / subject when
    // the visitor actually gave one.
    await transporter.sendMail({
      from: `"HB LINKS Contact Form" <${process.env.EMAIL_USER}>`,
      ...(mail ? { replyTo: mail } : {}),
      to: process.env.RECEIVER_EMAIL || DEFAULT_RECEIVER,
      subject: `Contact Form — ${mail || name || phone}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://i.imgur.com/g65VZMQ.png" alt="HB LINKS Logo" style="max-width: 180px; height: auto;" />
      <p style="margin: 12px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Contact Form Submission</p>
      <h1 style="margin: 8px 0 16px; font-size: 28px; font-weight: 600; color: #222;">You've received a new request</h1>
    </div>

    <div style="background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 0 4px rgba(0,0,0,0.05);">
      ${row("Name", name)}
      ${row("Phone", phone)}
      ${row("Texts", smsConsentAt ? `OK — opted in on the website ${smsConsentAt}` : "Not opted in on the website — ask before texting")}
      ${mail ? row("Email", mail) : ""}
      ${address ? row("Address", address) : ""}
      ${service ? row("Project Type", service) : ""}
      ${
        message
          ? `<p style="margin: 12px 0;"><strong>Message:</strong></p>
      <div style="margin-top: 8px; padding: 16px; background-color: #f1f1f1; border-radius: 6px; border: 1px solid #ddd; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>`
          : ""
      }
    </div>

    <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #999;">
      <p>This message was sent via the HB LINKS contact form.</p>
      <p style="margin-top: 4px;">© ${new Date().getFullYear()} HB LINKS</p>
    </div>
  </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
