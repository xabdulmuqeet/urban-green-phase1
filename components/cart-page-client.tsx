"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartSummarySkeleton, ShippingQuoteSkeleton } from "@/components/cart-summary-skeleton";
import { CartItemRow } from "@/components/cart-item-row";
import { useCart } from "@/components/cart-provider";
import {
  createCheckoutSessionFromApiWithShipping,
  fetchShippingQuoteFromApi
} from "@/lib/api-client";
import type { CheckoutAddress, ShippingMethodType, ShippingQuoteResponse } from "@/lib/api-types";
import { getPlantById } from "@/lib/data";
import {
  BUNDLE_SELECTION_STORAGE_KEY,
  createBundleSelectionFromCartItem
} from "@/hooks/use-bundle-builder";
import { formatCurrency } from "@/lib/format";

export function CartPageClient() {
  const router = useRouter();
  const { status } = useSession();
  const { cartItems, totalPrice, updateQuantity, removeFromCart, isReady } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCheckingShipping, setIsCheckingShipping] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState<CheckoutAddress>({
    recipientName: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    phoneNumber: "",
    deliveryNotes: ""
  });
  const [shippingQuote, setShippingQuote] = useState<ShippingQuoteResponse | null>(null);
  const [selectedShippingType, setSelectedShippingType] = useState<ShippingMethodType | null>(null);
  const requiredAddressFields: Array<[keyof Omit<CheckoutAddress, "deliveryNotes">, string]> = [
    ["recipientName", "recipient name"],
    ["streetAddress", "street address"],
    ["city", "city"],
    ["state", "state"],
    ["postalCode", "zip / postal code"],
    ["phoneNumber", "phone number"]
  ];

  const cartSignature = useMemo(
    () => cartItems.map((item) => `${item.cartKey}:${item.quantity}`).join("|"),
    [cartItems]
  );

  useEffect(() => {
    setShippingQuote(null);
    setSelectedShippingType(null);
    setShippingError("");
  }, [cartSignature, address.postalCode]);

  const updateAddress = (field: keyof CheckoutAddress, value: string) => {
    setAddress((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleEditBundle = (cartKey: string) => {
    const bundleItem = cartItems.find(
      (item) => item.kind === "bundle" && item.cartKey === cartKey
    );

    if (!bundleItem || bundleItem.kind !== "bundle") {
      return;
    }

    window.localStorage.setItem(
      BUNDLE_SELECTION_STORAGE_KEY,
      JSON.stringify(createBundleSelectionFromCartItem(bundleItem))
    );
    router.push(`/bundle?edit=${encodeURIComponent(bundleItem.cartKey)}`);
  };

  const handleCheckShipping = async () => {
    setIsCheckingShipping(true);
    setShippingError("");

    try {
      const quote = await fetchShippingQuoteFromApi(cartItems, address.postalCode.trim());
      setShippingQuote(quote);
      setSelectedShippingType(quote.selectedMethod);
    } catch (caughtError) {
      setShippingQuote(null);
      setSelectedShippingType(null);
      setShippingError(caughtError instanceof Error ? caughtError.message : "Failed to load delivery options.");
    } finally {
      setIsCheckingShipping(false);
    }
  };

  const missingAddressFields = requiredAddressFields.filter(
    ([field]) => address[field].trim().length === 0
  );

  const handleCheckout = async () => {
    if (status !== "authenticated" && customerEmail.trim().length === 0) {
      setCheckoutError("Enter an email address for guest checkout or sign in.");
      return;
    }

    if (missingAddressFields.length > 0) {
      setCheckoutError(`Add ${missingAddressFields[0]?.[1]} before checkout.`);
      return;
    }

    if (!shippingQuote || !selectedShippingType) {
      setCheckoutError("Check delivery options and choose a shipping method before checkout.");
      return;
    }

    if (shippingQuote.restrictionMessage) {
      setCheckoutError(shippingQuote.restrictionMessage);
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      const response = await createCheckoutSessionFromApiWithShipping(
        cartItems,
        {
          ...address,
          recipientName: address.recipientName.trim(),
          streetAddress: address.streetAddress.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          postalCode: address.postalCode.trim(),
          phoneNumber: address.phoneNumber.trim(),
          deliveryNotes: address.deliveryNotes?.trim() ?? ""
        },
        selectedShippingType,
        status === "authenticated" ? undefined : customerEmail.trim()
      );
      window.location.href = response.url;
    } catch (caughtError) {
      setCheckoutError(caughtError instanceof Error ? caughtError.message : "Failed to start checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isReady) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-card"
            >
              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <div className="premium-skeleton animate-shimmer h-28 w-full rounded-[1.5rem]" />
                <div className="space-y-3">
                  <div className="premium-skeleton animate-shimmer h-8 w-48 rounded-xl" />
                  <div className="premium-skeleton animate-shimmer h-4 w-28 rounded-xl" />
                  <div className="premium-skeleton animate-shimmer h-4 w-24 rounded-xl" />
                  <div className="premium-skeleton animate-shimmer h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <CartSummarySkeleton />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">Your cart is calm for now.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">
          Add a few plants to start building your collection.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const selectedShipping = shippingQuote?.availableMethods.find(
    (method) => method.type === selectedShippingType
  );
  const shippingCost = selectedShipping?.cost ?? 0;
  const checkoutTotal = totalPrice + shippingCost;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItemRow
            key={item.cartKey}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onEditBundle={handleEditBundle}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-bark/70">
            Order Summary
          </p>
          <div className="mt-6 space-y-4">
            {cartItems.map((item) => (
              (() => {
                const bundlePlant =
                  item.kind === "bundle" ? getPlantById(item.bundle.plantId) : null;
                const summaryName =
                  item.kind === "bundle"
                    ? `${bundlePlant?.name ?? "Bundle"} Bundle`
                    : item.name;

                return (
                  <div
                    key={`summary-${item.cartKey}`}
                    className="flex items-start justify-between gap-4 border-b border-black/5 pb-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{summaryName}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-bark/60">
                        {item.kind === "bundle"
                          ? `Bundle · ${item.bundle.plantVariantSize}`
                          : `${item.size} pot`}
                      </p>
                      <p className="text-sm text-bark/70">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                );
              })()
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-bark/70">
            Contact Info
          </p>
          {status !== "authenticated" ? (
            <>
              <label className="mt-4 block text-sm font-medium text-foreground" htmlFor="guest-email">
                Email Address
              </label>
              <input
                id="guest-email"
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-bark/65">
                <p>We&apos;ll use this email for order confirmation and delivery updates.</p>
                <button
                  type="button"
                  onClick={() => void signIn()}
                  className="whitespace-nowrap font-semibold uppercase tracking-[0.18em] text-sage"
                >
                  Sign In Instead
                </button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-6 text-bark/72">
              Your account email will be used for confirmations, tracking updates, and follow-up care guidance.
            </p>
          )}
        </div>

        <details className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card" open>
          <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.22em] text-bark/70">
            Delivery Address
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground" htmlFor="recipient-name">
                Recipient Name
              </label>
              <input
                id="recipient-name"
                type="text"
                value={address.recipientName}
                onChange={(event) => updateAddress("recipientName", event.target.value)}
                placeholder="Full name"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground" htmlFor="street-address">
                Street Address
              </label>
              <input
                id="street-address"
                type="text"
                value={address.streetAddress}
                onChange={(event) => updateAddress("streetAddress", event.target.value)}
                placeholder="Street address"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                value={address.city}
                onChange={(event) => updateAddress("city", event.target.value)}
                placeholder="City"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="state">
                State / Province
              </label>
              <input
                id="state"
                type="text"
                value={address.state}
                onChange={(event) => updateAddress("state", event.target.value)}
                placeholder="State"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="postal-code">
                Zip / Postal Code
              </label>
              <input
                id="postal-code"
                type="text"
                value={address.postalCode}
                onChange={(event) => updateAddress("postalCode", event.target.value)}
                placeholder="Enter zip code"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="phone-number">
                Phone Number
              </label>
              <input
                id="phone-number"
                type="tel"
                value={address.phoneNumber}
                onChange={(event) => updateAddress("phoneNumber", event.target.value)}
                placeholder="Phone number"
                className="mt-2 w-full rounded-full border border-black/10 bg-cream/30 px-5 py-3 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground" htmlFor="delivery-notes">
                Delivery Notes
              </label>
              <textarea
                id="delivery-notes"
                value={address.deliveryNotes ?? ""}
                onChange={(event) => updateAddress("deliveryNotes", event.target.value)}
                placeholder="Apartment, gate code, or pickup notes"
                className="mt-2 min-h-28 w-full rounded-[1.5rem] border border-black/10 bg-cream/30 px-5 py-4 text-sm text-foreground outline-none transition focus:border-sage"
              />
            </div>
          </div>
        </details>

        <details className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card" open>
          <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.22em] text-bark/70">
            Shipping Method
          </summary>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-sm text-sm leading-6 text-bark/70">
                We use the postal code from your delivery address to calculate the best available fulfillment method.
              </p>
              <button
                type="button"
                onClick={() => void handleCheckShipping()}
                disabled={isCheckingShipping || address.postalCode.trim().length < 3}
                className="rounded-full border border-black/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-sage disabled:cursor-not-allowed disabled:opacity-40 sm:self-start"
              >
                {isCheckingShipping ? "Checking..." : "Check Delivery"}
              </button>
            </div>
            {shippingError ? <p className="text-sm text-terracotta">{shippingError}</p> : null}
            {isCheckingShipping ? (
              <ShippingQuoteSkeleton />
            ) : shippingQuote ? (
              <div className="space-y-4">
                <p className="text-xs text-bark/70 sm:text-sm">
                  {shippingQuote.isLocalDeliveryZone
                    ? "Within our 20-mile local delivery zone."
                    : `Outside our local zone${shippingQuote.distanceMiles ? ` · ${shippingQuote.distanceMiles.toFixed(1)} miles away` : ""}.`}
                </p>
                {shippingQuote.weatherWarning ? (
                  <div className="rounded-[1.25rem] border border-terracotta/20 bg-terracotta/10 p-4 text-sm text-bark/80">
                    <p>{shippingQuote.weatherWarning}</p>
                    {shippingQuote.suggestedExtra ? (
                      <p className="mt-2 font-medium text-terracotta">
                        Suggested add-on: {shippingQuote.suggestedExtra.name}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {shippingQuote.restrictionMessage ? (
                  <div className="rounded-[1.25rem] border border-terracotta/20 bg-terracotta/10 p-4 text-sm text-bark/80">
                    {shippingQuote.restrictionMessage}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingQuote.availableMethods.map((method) => (
                      <label
                        key={method.type}
                        className="flex cursor-pointer items-center justify-between rounded-[1.25rem] border border-black/10 bg-cream/20 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-method"
                            checked={selectedShippingType === method.type}
                            onChange={() => setSelectedShippingType(method.type)}
                          />
                          <span className="text-sm font-medium text-foreground">{method.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(method.cost)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </details>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-bark/70">
            Final Total
          </p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-bark/75">
              <p>Subtotal</p>
              <p>{formatCurrency(totalPrice)}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-bark/75">
              <p>Shipping</p>
              <p>{formatCurrency(shippingCost)}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-5">
            <p className="font-[family:var(--font-heading)] text-3xl">Total</p>
            <p className="text-2xl font-semibold text-terracotta">{formatCurrency(checkoutTotal)}</p>
          </div>
          {checkoutError ? <p className="mt-4 text-sm text-terracotta">{checkoutError}</p> : null}
          <button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={
              isCheckingOut ||
              !shippingQuote ||
              !selectedShippingType ||
              Boolean(shippingQuote.restrictionMessage)
            }
            className="mt-6 w-full rounded-full bg-terracotta px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#cd624b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "authenticated"
              ? isCheckingOut
                ? "Redirecting To Checkout..."
                : "Checkout"
              : isCheckingOut
                ? "Redirecting To Checkout..."
                : "Continue As Guest"}
          </button>
        </div>
      </div>
    </div>
  );
}
