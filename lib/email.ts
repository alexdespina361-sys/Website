import { Resend } from "resend";
import { RESEND_FROM_FALLBACK, SITE_WORDMARK } from "@/lib/site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || RESEND_FROM_FALLBACK;

interface OrderEmailData {
  orderId: string;
  email: string;
  fullName: string | null;
  totalCents: number;
  items: Array<{
    name: string;
    size: string | null;
    color: string | null;
    quantity: number;
    priceCents: number;
  }>;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return null;
  }

  const { orderId, email, fullName, totalCents, items } = data;
  const totalRon = (totalCents / 100).toLocaleString("ro-RO", {
    style: "currency",
    currency: "RON",
  });

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e2e2;">
        ${item.name}
        ${
          item.size || item.color
            ? `<br><small style="color: #777;">${[item.size, item.color].filter(Boolean).join(", ")}</small>`
            : ""
        }
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e2e2; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e2e2; text-align: right;">
        ${((item.priceCents * item.quantity) / 100).toLocaleString("ro-RO", {
          style: "currency",
          currency: "RON",
        })}
      </td>
    </tr>
  `
    )
    .join("");

  try {
    const result = await resend.emails.send({
      from: resendFromEmail,
      to: email,
      subject: `Confirmare comanda #${orderId.slice(0, 8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Inter, Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
            <h1 style="font-family: 'Noto Serif', Georgia, serif; font-size: 32px; margin-bottom: 8px;">${SITE_WORDMARK}</h1>
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #5f5e5e; margin-bottom: 40px;">
              Confirmare comanda
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Multumim${fullName ? `, ${fullName}` : ""} pentru comanda dumneavoastra.
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: #5f5e5e; margin-bottom: 24px;">
              Plata se face ramburs, la livrare.
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #1a1c1c;">
                  <th style="padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Produs</th>
                  <th style="padding: 12px; text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Cant.</th>
                  <th style="padding: 12px; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;">Pret</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="text-align: right; margin-bottom: 40px;">
              <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin-right: 16px;">Total:</span>
              <span style="font-family: 'Noto Serif', Georgia, serif; font-size: 24px; color: #974730;">${totalRon}</span>
            </div>

            <hr style="border: none; border-top: 1px solid #e2e2e2; margin: 40px 0;">

            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #777; text-align: center;">
              © 2026 ${SITE_WORDMARK}. Toate drepturile rezervate.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message || "Order email failed");
    }

    return result;
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return null;
  }
}
