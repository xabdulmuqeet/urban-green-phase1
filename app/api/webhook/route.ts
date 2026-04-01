import mongoose from "mongoose";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongoose";
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/services/email-service";
import { CheckoutSessionModel } from "@/models/CheckoutSession";
import { OrderModel } from "@/models/Order";
import { UserModel } from "@/models/User";

function createOrderNumber(stripeSessionId: string) {
  return `UG-${Date.now().toString().slice(-6)}-${stripeSessionId.slice(-6).toUpperCase()}`;
}

async function findCheckoutSession(stripeSession: Stripe.Checkout.Session) {
  const checkoutToken = stripeSession.metadata?.checkoutToken;

  if (stripeSession.id) {
    const existingByStripeId = await CheckoutSessionModel.findOne({ stripeSessionId: stripeSession.id });

    if (existingByStripeId) {
      return existingByStripeId;
    }
  }

  if (checkoutToken) {
    return CheckoutSessionModel.findOne({ checkoutToken });
  }

  return null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    return;
  }

  await connectToDatabase();

  const checkoutSession = await findCheckoutSession(session);

  if (!checkoutSession) {
    throw new Error(`Checkout session ${session.id} not found.`);
  }

  if (!checkoutSession.stripeSessionId) {
    checkoutSession.stripeSessionId = session.id;
  }

  if (checkoutSession.status === "completed") {
    await checkoutSession.save();
    return;
  }

  const existingOrder = await OrderModel.findOne({ stripeSessionId: session.id });

  if (existingOrder) {
    checkoutSession.status = "completed";
    await checkoutSession.save();
    return;
  }

  const dbSession = await mongoose.startSession();

  try {
    let createdOrderId = "";

    await dbSession.withTransaction(async () => {
      const [order] = await OrderModel.create(
        [
          {
            ...(checkoutSession.userId ? { userId: checkoutSession.userId } : {}),
            orderNumber: createOrderNumber(session.id),
            customerEmail: checkoutSession.customerEmail,
            items: checkoutSession.items,
            totalAmount: checkoutSession.totalAmount,
            deliveryAddress: checkoutSession.deliveryAddress,
            destinationPostalCode: checkoutSession.destinationPostalCode,
            shippingType: checkoutSession.shippingType,
            shippingCost: checkoutSession.shippingCost,
            paymentStatus: "paid",
            stripeSessionId: session.id,
            followUpEmailScheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000)
          }
        ],
        { session: dbSession }
      );

      createdOrderId = String(order._id);

      if (checkoutSession.userId) {
        await UserModel.updateOne(
          { _id: checkoutSession.userId },
          { $set: { cart: [] } },
          { session: dbSession }
        );
      }

      checkoutSession.status = "completed";
      await checkoutSession.save({ session: dbSession });
    });

    if (createdOrderId) {
      const createdOrder = await OrderModel.findById(createdOrderId);

      if (createdOrder) {
        try {
          await sendOrderConfirmationEmail(createdOrder);
        } catch {
          // Keep webhook success tied to payment persistence, not email transport reliability.
        }
      }
    }
  } finally {
    await dbSession.endSession();
  }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  await connectToDatabase();

  const checkoutSession = await findCheckoutSession(session);

  if (!checkoutSession || checkoutSession.status === "completed") {
    return;
  }

  if (!checkoutSession.stripeSessionId) {
    checkoutSession.stripeSessionId = session.id;
  }

  checkoutSession.status = "expired";
  await checkoutSession.save();
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
    }

    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    const body = await request.text();
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "checkout.session.expired") {
      await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to handle webhook." },
      { status: 400 }
    );
  }
}
