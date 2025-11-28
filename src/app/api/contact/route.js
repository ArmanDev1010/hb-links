import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { name, phone, mail, address, message, token } = body;

  // Verify reCAPTCHA token
  const verifyRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=6LfqoQMsAAAAAA4sSxCVV_rioBGRJ4u6atj0Pagj&response=${token}`,
    }
  );

  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "arman.manukyan4.y@gmail.com",
        pass: "cejd degy pigo wcjp",
      },
    });

    await transporter.sendMail({
      from: `"HB LINKS Contact Form" - ${mail}`,
      replyTo: mail,
      to: "info@hb-links.com",
      subject: `Contact Form — ${mail}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="https://i.imgur.com/g65VZMQ.png" alt="HB LINKS Logo" style="max-width: 180px; height: auto;" />
      <p style="margin: 12px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">Contact Form Submission</p>
      <h1 style="margin: 8px 0 16px; font-size: 28px; font-weight: 600; color: #222;">You've received a new request</h1>
    </div>

    <div style="background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 0 4px rgba(0,0,0,0.05);">
      <p style="margin: 12px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin: 12px 0;"><strong>Phone:</strong> ${phone}</p>
      <p style="margin: 12px 0;"><strong>Email:</strong> ${mail}</p>
      <p style="margin: 12px 0;"><strong>Address:</strong> ${address}</p>
      <p style="margin: 12px 0;"><strong>Message:</strong></p>
      <div style="margin-top: 8px; padding: 16px; background-color: #f1f1f1; border-radius: 6px; border: 1px solid #ddd; font-size: 14px; line-height: 1.6;">
        ${message}
      </div>
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
