import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type Stripe from "stripe";
import { createCheckoutSchema } from "@/lib/validators";
import { getProductsMap, normalizeAndMergeCartItems } from "@/lib/commerce";
import type { ApiCartItem } from "@/lib/api-types";
import { getAppBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import { getCurrentSessionEmail, requireCurrentUser } from "@/lib/session";
import { isDatabaseConfigured } from "@/lib/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { CheckoutSessionModel } from "@/models/CheckoutSession";
import { validateShippingSelection } from "@/lib/services/shipping-service";

function buildBundleDescription(item: Extract<ApiCartItem, { type: "bundle" }>, productsById: Map<string, {
  id: string;
  type: "plant" | "pot" | "extra";
  name?: string;
}>) {
  const plantName = productsById.get(item.bundle.plant)?.name ?? item.bundle.plant;
  const potName = productsById.get(item.bundle.pot)?.name ?? item.bundle.pot;
  const extrasLabel =
    item.bundle.extras.length > 0
      ? item.bundle.extras
          .map((extraId) => productsById.get(extraId)?.name ?? extraId)
          .join(", ")
      : "No extras";

  return `${plantName} (${item.bundle.size}) + ${potName} + ${extrasLabel}`;
}

export async function POST(request: Request) {
  const limitedResponse = rateLimit(request, {
    keyPrefix: "checkout-create",
    limit: 12,
    windowMs: 10 * 60 * 1000,
    message: "Too many checkout attempts. Please wait a moment and try again."
  });

  if (limitedResponse) {
    return limitedResponse;
  }

  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured. Add MONGODB_URI to .env.local to start checkout." },
        { status: 503 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe not configured. Add STRIPE_SECRET_KEY to .env.local to start checkout." },
        { status: 503 }
      );
    }

    const payload = createCheckoutSchema.parse(await request.json());
    const sessionEmail = await getCurrentSessionEmail();
    const user = sessionEmail ? await requireCurrentUser() : null;
    const customerEmail = sessionEmail ?? payload.customerEmail?.trim().toLowerCase();
    const deliveryAddress = {
      recipientName: payload.address.recipientName.trim(),
      streetAddress: payload.address.streetAddress.trim(),
      city: payload.address.city.trim(),
      state: payload.address.state.trim(),
      postalCode: payload.address.postalCode.trim(),
      phoneNumber: payload.address.phoneNumber.trim(),
      deliveryNotes: payload.address.deliveryNotes?.trim() ?? ""
    };

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Enter an email address or sign in before checkout." },
        { status: 400 }
      );
    }

    const sourceItems = (payload.items ?? user?.cart ?? []) as ApiCartItem[];

    if (sourceItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const normalizedItems = await normalizeAndMergeCartItems(sourceItems);
    const { quote, selectedMethod } = await validateShippingSelection(
      normalizedItems,
      {
        postalCode: deliveryAddress.postalCode,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        countryCode: "AU"
      },
      payload.shippingType
    );
    const checkoutToken = randomUUID();
    const ids = new Set<string>();

    normalizedItems.forEach((item) => {
      if (item.type === "single") {
        ids.add(item.productId);
        return;
      }

      ids.add(item.bundle.plant);
      ids.add(item.bundle.pot);
      item.bundle.extras.forEach((extraId) => ids.add(extraId));
    });

    const productsById = await getProductsMap([...ids]);
    const stripe = getStripe();
    const baseUrl = getAppBaseUrl();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = normalizedItems.map((item) => {
      if (item.type === "single") {
        const product = productsById.get(item.productId);

        return {
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: product?.name ?? item.productId,
              description: `Size ${item.size}`
            }
          }
        };
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.bundle.totalPrice * 100),
          product_data: {
            name: "Custom Plant Bundle",
            description: buildBundleDescription(item, productsById)
          }
        }
      };
    });

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(selectedMethod.cost * 100),
        product_data: {
          name: selectedMethod.label,
          description: `Shipping to ${deliveryAddress.postalCode}`
        }
      }
    });

    const checkoutSession = await CheckoutSessionModel.create({
      ...(user ? { userId: user._id } : {}),
      customerEmail,
      items: normalizedItems,
      totalAmount: quote.totalAmount,
      subtotalAmount: quote.subtotal,
      deliveryAddress,
      destinationPostalCode: deliveryAddress.postalCode,
      shippingType: selectedMethod.type,
      shippingCost: selectedMethod.cost,
      weatherWarning: quote.weatherWarning,
      status: "pending",
      checkoutToken
    });

    try {
      const stripeSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: customerEmail,
        line_items: lineItems,
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel`,
        metadata: {
          ...(user ? { userId: String(user._id) } : {}),
          checkoutToken,
          shippingType: selectedMethod.type,
          destinationPostalCode: deliveryAddress.postalCode
        }
      });

      checkoutSession.stripeSessionId = stripeSession.id;
      await checkoutSession.save();

      if (!stripeSession.url) {
        checkoutSession.status = "failed";
        await checkoutSession.save();
        return NextResponse.json({ error: "Stripe checkout URL was not created." }, { status: 500 });
      }

      return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
      checkoutSession.status = "failed";
      await checkoutSession.save();
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session." },
      { status: 400 }
    );
  }
}
