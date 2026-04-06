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
  subtotal: number;
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

function formatConditionLabel(condition?: string) {
  if (!condition) {
    return null;
  }

  return condition === "fragile" ? "Air Purifying" : "Low Light";
}

function formatClassificationLabel(category?: string, displayCategory?: string) {
  return (displayCategory ?? category ?? "Specimen").toUpperCase();
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
        const product = productsById.get(item.productId);
        const productName = product?.name ?? item.productId;
        const sizeLabel = item.size ?? "Selected size";
        const detailTags = [
          formatConditionLabel(product?.condition),
          product?.plantSize ? `${product.plantSize} Specimen` : null
        ].filter(Boolean);

        return {
          text: `• ${productName} (${sizeLabel}) x${item.quantity}`,
          html: `
            <div style="display:table;width:100%;padding:20px 0;border-top:1px solid #e5eadf;">
              <div style="display:table-cell;width:92px;vertical-align:top;">
                <img src="${escapeHtml(product?.images?.[0] ?? "")}" alt="${escapeHtml(productName)}" width="80" height="80" style="display:block;width:80px;height:80px;object-fit:cover;background:#eef1ea;" />
              </div>
              <div style="display:table-cell;vertical-align:top;padding-left:18px;">
                <p style="margin:0 0 4px;font-size:16px;line-height:1.3;font-weight:600;color:#4f6f37;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(productName)}</p>
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9aa18f;">Classification · ${escapeHtml(formatClassificationLabel(product?.category, product?.displayCategory))}</p>
                <div style="font-size:0;">
                  ${detailTags
                    .map(
                      (tag) =>
                        `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 8px;background:#eef1ea;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8f9882;">${escapeHtml(tag!)}</span>`
                    )
                    .join("")}
                </div>
                <p style="margin:2px 0 0;font-size:12px;color:#7c8570;">Size ${escapeHtml(sizeLabel)} · Qty ${item.quantity}</p>
              </div>
              <div style="display:table-cell;width:96px;vertical-align:top;text-align:right;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#7f896f;">$${((item.price ?? 0) * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          `,
          subtotal: (item.price ?? 0) * item.quantity
        };
      }

      const plant = item.bundle?.plant ? productsById.get(item.bundle.plant) : null;
      const plantName = plant?.name ?? item.bundle?.plant ?? "Plant";
      const extrasLabel =
        item.bundle?.extras?.length
          ? item.bundle.extras.map((extraId) => productsById.get(extraId)?.name ?? extraId).join(", ")
          : "No extras";
      const detailTags = [
        formatConditionLabel(plant?.condition),
        plant?.plantSize ? `${plant.plantSize} Specimen` : null
      ].filter(Boolean);

        return {
        text: `• Custom Plant Bundle: ${plantName} (${item.bundle?.size ?? "6\""}) + ${extrasLabel} x${item.quantity}`,
        html: `
          <div style="display:table;width:100%;padding:20px 0;border-top:1px solid #e5eadf;">
            <div style="display:table-cell;width:92px;vertical-align:top;">
              <img src="${escapeHtml(plant?.images?.[0] ?? "")}" alt="${escapeHtml(plantName)}" width="80" height="80" style="display:block;width:80px;height:80px;object-fit:cover;background:#eef1ea;" />
            </div>
            <div style="display:table-cell;vertical-align:top;padding-left:18px;">
              <p style="margin:0 0 4px;font-size:16px;line-height:1.3;font-weight:600;color:#4f6f37;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(plantName)}</p>
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9aa18f;">Classification · ${escapeHtml(formatClassificationLabel(plant?.category, plant?.displayCategory))}</p>
              <div style="font-size:0;">
                ${detailTags
                  .map(
                    (tag) =>
                      `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 8px;background:#eef1ea;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8f9882;">${escapeHtml(tag!)}</span>`
                  )
                  .join("")}
              </div>
              <p style="margin:2px 0 0;font-size:12px;color:#7c8570;">Bundle Size ${escapeHtml(item.bundle?.size ?? '6"')} · Qty ${item.quantity}</p>
              <p style="margin:6px 0 0;font-size:12px;color:#7c8570;">Extras: ${escapeHtml(extrasLabel)}</p>
            </div>
            <div style="display:table-cell;width:96px;vertical-align:top;text-align:right;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#7f896f;">$${((item.bundle?.totalPrice ?? 0) * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        `,
        subtotal: (item.bundle?.totalPrice ?? 0) * item.quantity
      };
    })

  return {
    text: entries.map((entry) => entry.text).join("\n"),
    html: entries.map((entry) => entry.html).join(""),
    subtotal: entries.reduce((sum, entry) => sum + entry.subtotal, 0)
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
    .map((line) => `<p style="margin:0 0 6px;font-size:13px;line-height:1.7;color:#66705f;">${line}</p>`)
    .join("");
}

function buildEmailShell({
  eyebrow,
  title,
  intro,
  order,
  summaryHtml,
  summarySubtotal,
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
  summarySubtotal: number;
  addressHtml: string;
  ctaLabel: string;
  ctaHref: string;
  footerNote: string;
}) {
  return `
    <div style="margin:0;padding:36px 20px;background:#f8faf5;font-family:Manrope,Arial,sans-serif;">
      <div style="max-width:680px;margin:0 auto;">
        <div style="padding:0 0 28px;text-align:center;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#9aa18f;">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 auto;max-width:440px;font-size:32px;line-height:0.95;color:#4f6f37;font-weight:700;font-family:Georgia,'Times New Roman',serif;text-align:center;">${escapeHtml(title)}</h1>
          <p style="margin:18px auto 0;max-width:500px;font-size:15px;line-height:1.8;color:#7c8570;text-align:center;">${escapeHtml(intro)}</p>
        </div>

        <div style="padding:34px 40px;background:#fffefb;border:1px solid #e5eadf;">
          <div style="padding:0 0 4px;">
            <p style="margin:0 0 18px;font-size:14px;line-height:1.3;font-weight:700;color:#6e7565;font-family:Georgia,'Times New Roman',serif;">Acquisition Details</p>
            ${summaryHtml}
          </div>

          <div style="padding-top:18px;text-align:right;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9aa18f;">Subtotal <span style="display:inline-block;min-width:90px;text-align:right;color:#7c8570;">$${summarySubtotal.toFixed(2)}</span></p>
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9aa18f;">Archive Shipping <span style="display:inline-block;min-width:90px;text-align:right;color:#7c8570;">$${order.shippingCost.toFixed(2)}</span></p>
            <p style="margin:12px 0 0;font-size:18px;line-height:1.3;color:#6d8a4f;font-style:italic;font-family:Georgia,'Times New Roman',serif;">Total Investment <span style="display:inline-block;min-width:90px;text-align:right;font-style:normal;font-weight:700;">$${order.totalAmount.toFixed(2)}</span></p>
          </div>
        </div>

        <div style="margin-top:34px;display:table;width:100%;border-spacing:0;">
          <div style="display:table-cell;width:50%;vertical-align:top;padding:0 18px 0 0;">
            <div style="border-left:3px solid #6d8a4f;padding-left:16px;">
              <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#9aa18f;">Archive Destination</p>
              ${addressHtml}
            </div>
          </div>
          <div style="display:table-cell;width:50%;vertical-align:top;padding:0 0 0 18px;">
            <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#9aa18f;">Transit Window</p>
            <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#7c8570;">Shipping method</p>
            <p style="margin:0 0 18px;font-size:20px;line-height:1.3;color:#6d8a4f;font-style:italic;font-family:Georgia,'Times New Roman',serif;">${escapeHtml(formatShippingType(order.shippingType))}</p>
            <p style="margin:0;font-size:11px;line-height:1.7;color:#8c9480;">Order Number · ${escapeHtml(order.orderNumber)}</p>
            <div style="margin-top:16px;">
              <a href="${escapeHtml(ctaHref)}" style="display:inline-block;padding:11px 18px;background:#556f41;color:#ffffff;text-decoration:none;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">${escapeHtml(ctaLabel)}</a>
            </div>
          </div>
        </div>

        <div style="padding:42px 20px 0;text-align:center;">
          <p style="margin:0;font-size:26px;line-height:1.2;color:#6d8a4f;font-style:italic;font-family:Georgia,'Times New Roman',serif;">A Living Record</p>
          <p style="margin:14px auto 0;max-width:520px;font-size:13px;line-height:1.8;color:#8a927e;">${escapeHtml(footerNote)}</p>
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
    title: "Your Botanical Journey Begins",
    intro: `Hello ${order.deliveryAddress.recipientName.split(" ")[0] ?? "there"}, your new specimens are being prepared for their journey. Each plant has been meticulously inspected and documented in our archive before being carefully packaged for relocation.`,
    order,
    summaryHtml: summary.html,
    summarySubtotal: summary.subtotal,
    addressHtml,
    ctaLabel: "Track Specimens",
    ctaHref: careGuideLink,
    footerNote: "As part of our commitment to the Botanical Archivist philosophy, your plants come with a unique digital passport. Log into your account to access care historical data and seasonal growth projections for these specific specimens."
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
      title: "A Living Botanical Record",
      intro: "A little check-in from The Urban Green with care guidance for the plants and bundle pieces now settling into your space.",
      order,
      summaryHtml: summary.html,
      summarySubtotal: summary.subtotal,
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
