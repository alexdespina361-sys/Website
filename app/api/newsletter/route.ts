import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_EMAIL,
  RESEND_FROM_FALLBACK,
  SITE_NAME,
  SITE_WORDMARK,
} from "@/lib/site";

const resendApiKey = process.env.RESEND_API_KEY;
const contactEmailTo = process.env.CONTACT_EMAIL_TO || CONTACT_EMAIL;
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || RESEND_FROM_FALLBACK;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Serviciul de email nu este configurat." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Introdu o adresa de email valida." },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: resendFromEmail,
      to: contactEmailTo,
      replyTo: email,
      subject: `Abonare newsletter - ${SITE_NAME}`,
      html: `
        <h2>Abonare noua la newsletter pe ${SITE_WORDMARK}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p>Acest contact a fost trimis din formularul de pe pagina principala.</p>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Nu am putut trimite abonarea." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nu am putut inregistra abonarea.",
      },
      { status: 500 }
    );
  }
}
