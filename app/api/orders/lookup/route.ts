import { NextResponse } from "next/server";
import { guestOrderLookupSchema } from "@/lib/validators";
import { OrderModel, type OrderHydratedDocument } from "@/models/Order";
import { isDatabaseConfigured } from "@/lib/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { finalizePaidCheckoutSession } from "@/lib/services/order-finalization-service";

function toOrderResponse(order: OrderHydratedDocument | null) {
  if (!order) {
    return null;
  }

  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    items: order.items,
    totalAmount: order.totalAmount,
    paymentStatus: order.paymentStatus,
    deliveryAddress: order.deliveryAddress,
    destinationPostalCode: order.destinationPostalCode,
    shippingType: order.shippingType,
    shippingCost: order.shippingCost,
    createdAt: order.createdAt.toISOString()
  };
}

export async function GET(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "order-lookup-session",
    limit: 20,
    windowMs: 5 * 60 * 1000
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
    }

    let order = await OrderModel.findOne({ stripeSessionId: sessionId });

    if (!order && isStripeConfigured()) {
      const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId);
      order = await finalizePaidCheckoutSession(stripeSession);
    }

    const response = toOrderResponse(order);

    if (!response) {
      return NextResponse.json({ error: "Order not ready yet." }, { status: 404 });
    }

    return NextResponse.json({ order: response });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch order." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "order-lookup-guest",
    limit: 8,
    windowMs: 10 * 60 * 1000,
    message: "Too many order lookups. Please wait a bit and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const payload = guestOrderLookupSchema.parse(await request.json());
    const order = await OrderModel.findOne({
      customerEmail: payload.email.trim().toLowerCase(),
      orderNumber: payload.orderNumber.trim().toUpperCase()
    });
    const response = toOrderResponse(order);

    if (!response) {
      return NextResponse.json(
        { error: "We could not find a matching order." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: response });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to look up order." },
      { status: 400 }
    );
  }
}
