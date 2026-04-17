import type Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import { sendOrderConfirmationEmail } from "@/lib/services/email-service";
import { CheckoutSessionModel } from "@/models/CheckoutSession";
import { OrderModel, type OrderHydratedDocument } from "@/models/Order";
import { UserModel } from "@/models/User";

function createOrderNumber(stripeSessionId: string) {
  return `UG-${Date.now().toString().slice(-6)}-${stripeSessionId.slice(-6).toUpperCase()}`;
}

async function findCheckoutSession(stripeSession: Stripe.Checkout.Session) {
  const checkoutToken = stripeSession.metadata?.checkoutToken;

  if (stripeSession.id) {
    const existingByStripeId = await CheckoutSessionModel.findOne({
      stripeSessionId: stripeSession.id
    });

    if (existingByStripeId) {
      return existingByStripeId;
    }
  }

  if (checkoutToken) {
    return CheckoutSessionModel.findOne({ checkoutToken });
  }

  return null;
}

async function sendConfirmationIfNeeded(order: OrderHydratedDocument) {
  if (order.confirmationEmailSentAt) {
    return;
  }

  try {
    await sendOrderConfirmationEmail(order);
  } catch (error) {
    console.error("Order confirmation email failed.", error);
  }
}

export async function finalizePaidCheckoutSession(stripeSession: Stripe.Checkout.Session) {
  if (stripeSession.payment_status !== "paid") {
    return null;
  }

  await connectToDatabase();

  const checkoutSession = await findCheckoutSession(stripeSession);

  if (!checkoutSession) {
    throw new Error(`Checkout session ${stripeSession.id} not found.`);
  }

  if (!checkoutSession.stripeSessionId) {
    checkoutSession.stripeSessionId = stripeSession.id;
    await checkoutSession.save();
  }

  const existingOrder = await OrderModel.findOne({ stripeSessionId: stripeSession.id });

  if (existingOrder) {
    checkoutSession.status = "completed";
    await checkoutSession.save();
    await sendConfirmationIfNeeded(existingOrder);
    return existingOrder;
  }

  const createdOrder = await OrderModel.create({
    ...(checkoutSession.userId ? { userId: checkoutSession.userId } : {}),
    orderNumber: createOrderNumber(stripeSession.id),
    customerEmail: checkoutSession.customerEmail,
    items: checkoutSession.items,
    totalAmount: checkoutSession.totalAmount,
    deliveryAddress: checkoutSession.deliveryAddress,
    destinationPostalCode: checkoutSession.destinationPostalCode,
    shippingType: checkoutSession.shippingType,
    shippingCost: checkoutSession.shippingCost,
    paymentStatus: "paid",
    stripeSessionId: stripeSession.id,
    followUpEmailScheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000)
  });

  if (checkoutSession.userId) {
    await UserModel.updateOne({ _id: checkoutSession.userId }, { $set: { cart: [] } });
  }

  checkoutSession.status = "completed";
  await checkoutSession.save();
  await sendConfirmationIfNeeded(createdOrder);

  return createdOrder;
}

export async function markCheckoutSessionExpired(stripeSession: Stripe.Checkout.Session) {
  await connectToDatabase();

  const checkoutSession = await findCheckoutSession(stripeSession);

  if (!checkoutSession || checkoutSession.status === "completed") {
    return;
  }

  if (!checkoutSession.stripeSessionId) {
    checkoutSession.stripeSessionId = stripeSession.id;
  }

  checkoutSession.status = "expired";
  await checkoutSession.save();
}
