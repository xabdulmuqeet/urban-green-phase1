import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isDatabaseConfigured } from "@/lib/mongoose";
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from "@/lib/stripe";
import {
  finalizePaidCheckoutSession,
  markCheckoutSessionExpired
} from "@/lib/services/order-finalization-service";

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
      await finalizePaidCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "checkout.session.expired") {
      await markCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to handle webhook." },
      { status: 400 }
    );
  }
}
