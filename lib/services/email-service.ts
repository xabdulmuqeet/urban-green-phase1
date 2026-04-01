import nodemailer from "nodemailer";
import { getProductsMap } from "@/lib/commerce";
import { getAppBaseUrl } from "@/lib/stripe";
import { OrderModel, type OrderHydratedDocument } from "@/models/Order";

const smtpHost = process.env.EMAIL_SERVER_HOST;
const smtpPort = Number(process.env.EMAIL_SERVER_PORT ?? "587");
const smtpUser = process.env.EMAIL_SERVER_USER;
const smtpPassword = process.env.EMAIL_SERVER_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

function isEmailConfigured() {
  return Boolean(smtpHost && smtpUser && smtpPassword && emailFrom);
}

function getTransporter() {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    }
  });
}

type OrderEmailSummary = {
  text: string;
  html: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatShippingType(type: OrderHydratedDocument["shippingType"]) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function buildOrderSummary(order: OrderHydratedDocument): Promise<OrderEmailSummary> {
  const ids = new Set<string>();

  order.items.forEach((item) => {
    if (item.type === "single" && item.productId) {
      ids.add(item.productId);
      return;
    }

    if (item.type === "bundle" && item.bundle?.plant && item.bundle?.pot) {
      ids.add(item.bundle.plant);
      ids.add(item.bundle.pot);
      item.bundle.extras.forEach((extraId) => ids.add(extraId));
    }
  });

  const productsById = await getProductsMap([...ids]);

  const entries = order.items.map((item) => {
      if (item.type === "single" && item.productId) {
        const productName = productsById.get(item.productId)?.name ?? item.productId;
        const sizeLabel = item.size ?? "Selected size";
        return {
          text: `• ${productName} (${sizeLabel}) x${item.quantity}`,
          html: `
            <div style="padding:16px 0;border-top:1px solid #ece6df;">
              <p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#1f1f1f;">${escapeHtml(productName)}</p>
              <p style="margin:0;color:#6f675f;font-size:14px;">Size ${escapeHtml(sizeLabel)} · Qty ${item.quantity}</p>
            </div>
          `
        };
      }

      const plantName = item.bundle?.plant ? productsById.get(item.bundle.plant)?.name ?? item.bundle.plant : "Plant";
      const potName = item.bundle?.pot ? productsById.get(item.bundle.pot)?.name ?? item.bundle.pot : "Pot";
      const extrasLabel =
        item.bundle?.extras?.length
          ? item.bundle.extras.map((extraId) => productsById.get(extraId)?.name ?? extraId).join(", ")
          : "No extras";

        return {
        text: `• Custom Plant Bundle: ${plantName} (${item.bundle?.size ?? "6\""}) + ${potName} + ${extrasLabel} x${item.quantity}`,
        html: `
          <div style="padding:16px 0;border-top:1px solid #ece6df;">
            <p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#1f1f1f;">Custom Plant Bundle</p>
            <p style="margin:0;color:#6f675f;font-size:14px;">${escapeHtml(plantName)} (${escapeHtml(item.bundle?.size ?? '6"')}) + ${escapeHtml(potName)}</p>
            <p style="margin:6px 0 0;color:#6f675f;font-size:14px;">Extras: ${escapeHtml(extrasLabel)} · Qty ${item.quantity}</p>
          </div>
        `
      };
    })

  return {
    text: entries.map((entry) => entry.text).join("\n"),
    html: entries.map((entry) => entry.html).join("")
  };
}

function formatDeliveryAddress(order: OrderHydratedDocument) {
  const address = order.deliveryAddress;

  return [
    address.recipientName,
    address.streetAddress,
    `${address.city}, ${address.state} ${address.postalCode}`,
    `Phone: ${address.phoneNumber}`,
    address.deliveryNotes ? `Delivery notes: ${address.deliveryNotes}` : null
  ]
    .filter(Boolean)
    .join("\n");
}

function buildAddressHtml(order: OrderHydratedDocument) {
  const address = order.deliveryAddress;

  return [
    escapeHtml(address.recipientName),
    escapeHtml(address.streetAddress),
    `${escapeHtml(address.city)}, ${escapeHtml(address.state)} ${escapeHtml(address.postalCode)}`,
    `Phone: ${escapeHtml(address.phoneNumber)}`,
    address.deliveryNotes ? `Notes: ${escapeHtml(address.deliveryNotes)}` : null
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 6px;font-size:14px;color:#4f463f;">${line}</p>`)
    .join("");
}

function buildEmailShell({
  eyebrow,
  title,
  intro,
  order,
  summaryHtml,
  addressHtml,
  ctaLabel,
  ctaHref,
  footerNote
}: {
  eyebrow: string;
  title: string;
  intro: string;
  order: OrderHydratedDocument;
  summaryHtml: string;
  addressHtml: string;
  ctaLabel: string;
  ctaHref: string;
  footerNote: string;
}) {
  return `
    <div style="margin:0;padding:48px 20px;background:
      radial-gradient(circle at top left,#efe4d6 0%,rgba(239,228,214,0) 34%),
      radial-gradient(circle at bottom right,#d8e1d3 0%,rgba(216,225,211,0) 28%),
      linear-gradient(180deg,#f5efe7 0%,#efe6db 100%);
      font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:680px;margin:0 auto;background:#fffdf9;border-radius:36px;overflow:hidden;border:1px solid #e9dfd3;box-shadow:0 28px 70px rgba(91,72,54,0.12);">
        <div style="position:relative;padding:44px 40px 30px;background:
          linear-gradient(145deg,#fbf6ef 0%,#f4eadf 52%,#eef3ea 100%);
          border-bottom:1px solid #eadfd3;">
          <div style="position:relative;">
            <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:0.34em;text-transform:uppercase;color:#8b7766;">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0;font-size:30px;line-height:1.15;color:#1e1b18;font-weight:600;">${escapeHtml(title)}</h1>
            <p style="margin:16px 0 0;max-width:520px;font-size:15px;line-height:1.75;color:#64584d;">${escapeHtml(intro)}</p>
          </div>
        </div>

        <div style="padding:34px 40px 18px;">
          <div style="margin-bottom:28px;padding:24px 26px;border-radius:26px;background:linear-gradient(180deg,#fbf7f1 0%,#f7f0e7 100%);border:1px solid #ece1d5;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#8b7766;">Order Number</p>
            <p style="margin:0;font-size:22px;line-height:1.2;color:#1f1c18;">${escapeHtml(order.orderNumber)}</p>
          </div>

          <div style="padding:0 0 4px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#8b7766;">Order Summary</p>
            ${summaryHtml}
          </div>

          <div style="margin-top:28px;padding:24px 26px;border-radius:26px;background:linear-gradient(180deg,#f9f5ee 0%,#f4ece2 100%);border:1px solid #ece1d5;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#8b7766;">Delivery Details</p>
            ${addressHtml}
            <div style="margin-top:18px;padding-top:16px;border-top:1px solid #e8dbcd;">
              <p style="margin:0 0 8px;font-size:14px;color:#4f463f;"><strong>Shipping:</strong> ${escapeHtml(formatShippingType(order.shippingType))} ($${order.shippingCost.toFixed(2)})</p>
              <p style="margin:0;font-size:16px;color:#2a241f;"><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>

          <div style="margin-top:32px;text-align:center;">
            <a href="${escapeHtml(ctaHref)}" style="display:inline-block;padding:15px 28px;border-radius:999px;background:linear-gradient(180deg,#cf7459 0%,#c15e46 100%);box-shadow:0 14px 28px rgba(193,94,70,0.24);color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;">${escapeHtml(ctaLabel)}</a>
          </div>
        </div>

        <div style="padding:24px 40px 30px;border-top:1px solid #ece1d5;background:linear-gradient(180deg,#fffaf5 0%,#f7efe5 100%);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.26em;text-transform:uppercase;color:#8b7766;">The Urban Green</p>
            <p style="margin:0;font-size:12px;color:#8b7766;">Curated plants, thoughtful care, calm interiors.</p>
          </div>
          <p style="margin:14px 0 0;font-size:13px;line-height:1.8;color:#7a7068;">${escapeHtml(footerNote)}</p>
        </div>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, text: string, html: string) {
  const transporter = getTransporter();

  if (!transporter || !emailFrom) {
    return false;
  }

  await transporter.sendMail({
    to,
    from: emailFrom,
    subject,
    text,
    html
  });

  return true;
}

export async function sendOrderConfirmationEmail(order: OrderHydratedDocument) {
  const summary = await buildOrderSummary(order);
  const careGuideLink = `${getAppBaseUrl()}/care-guide`;
  const addressBlock = formatDeliveryAddress(order);
  const addressHtml = buildAddressHtml(order);
  const text = `Thank you for your order.\n\nOrder number: ${order.orderNumber}\n\nOrder summary:\n${summary.text}\n\nDelivery address:\n${addressBlock}\n\nShipping: ${formatShippingType(order.shippingType)} ($${order.shippingCost.toFixed(2)})\nTotal: $${order.totalAmount.toFixed(2)}\n\nCare guide: ${careGuideLink}`;
  const html = buildEmailShell({
    eyebrow: "The Urban Green",
    title: "Your order is confirmed",
    intro: "We’ve received your order and your plants are being prepared with care.",
    order,
    summaryHtml: summary.html,
    addressHtml,
    ctaLabel: "Open Care Guide",
    ctaHref: careGuideLink,
    footerNote: "Thank you for choosing The Urban Green. We’ll follow up with care tips once your order has had time to settle in."
  });

  const sent = await sendEmail(
    order.customerEmail,
    "Your Urban Green order is confirmed",
    text,
    html
  );

  if (sent) {
    order.confirmationEmailSentAt = new Date();
    await order.save();
  }
}

export async function sendDueFollowUpEmails() {
  const transporter = getTransporter();

  if (!transporter) {
    return { processed: 0 };
  }

  const dueOrders = await OrderModel.find({
    followUpEmailScheduledFor: { $lte: new Date() },
    followUpEmailSentAt: null
  });

  for (const order of dueOrders) {
    const summary = await buildOrderSummary(order);
    const careGuideLink = `${getAppBaseUrl()}/care-guide`;
    const addressBlock = formatDeliveryAddress(order);
    const addressHtml = buildAddressHtml(order);
    const text = `We hope your order is settling in beautifully.\n\nOrder number: ${order.orderNumber}\n\nOrder recap:\n${summary.text}\n\nDelivery address:\n${addressBlock}\n\nCare guide: ${careGuideLink}`;
    const html = buildEmailShell({
      eyebrow: "Plant Care Follow-Up",
      title: "How is your order settling in?",
      intro: "A little check-in from The Urban Green with care guidance for the plants and bundle pieces you brought home.",
      order,
      summaryHtml: summary.html,
      addressHtml,
      ctaLabel: "View Care Guide",
      ctaHref: careGuideLink,
      footerNote: "If your plant needs a little extra attention, the care guide above is the best place to start."
    });

    await transporter.sendMail({
      to: order.customerEmail,
      from: emailFrom!,
      subject: "How is your Urban Green order settling in?",
      text,
      html
    });

    order.followUpEmailSentAt = new Date();
    await order.save();
  }

  return { processed: dueOrders.length };
}
