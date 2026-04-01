import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

let stripeClient: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil"
    });
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable.");
  }

  return STRIPE_WEBHOOK_SECRET;
}

export function getAppBaseUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:8090";
}
