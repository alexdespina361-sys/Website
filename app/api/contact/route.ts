import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const contactEmailTo = process.env.CONTACT_EMAIL_TO || "hello@redstudio.ro";
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || "RED STUDIO <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Toate câmpurile sunt obligatorii" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: resendFromEmail,
      to: contactEmailTo,
      replyTo: email,
      subject: `Mesaj de la ${name} — RED STUDIO Contact`,
      html: `
        <h2>Mesaj nou de pe site-ul RED STUDIO</h2>
        <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Eroare la trimiterea mesajului" },
      { status: 500 }
    );
  }
}
