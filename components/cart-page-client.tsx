"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartSummarySkeleton, ShippingQuoteSkeleton } from "@/components/cart-summary-skeleton";
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
  const { status, data: session } = useSession();
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

  const accountEmail = session?.user?.email ?? "";
  const contactEmail = status === "authenticated" ? accountEmail : customerEmail;
  const nameParts = address.recipientName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.slice(-1)[0] ?? "";

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

  const updateRecipientName = (nextFirst: string, nextLast: string) => {
    updateAddress("recipientName", `${nextFirst} ${nextLast}`.trim());
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
      setShippingError(
        caughtError instanceof Error ? caughtError.message : "Failed to load delivery options."
      );
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
      setCheckoutError(
        caughtError instanceof Error ? caughtError.message : "Failed to start checkout."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderInput = (
    id: string,
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    type = "text",
    readOnly = false
  ) => (
    <div>
      <label
        className="mb-1 block font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.2em] text-[#777777]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="h-12 w-full border-0 border-b border-[#c6c6c6]/20 bg-white px-4 py-0 text-[#191c1a] leading-[1.2] placeholder:leading-[1.2] placeholder:text-[#c6c6c6] focus:border-[#516448] focus:outline-none focus:ring-0 read-only:text-[#777777]"
      />
    </div>
  );

  if (!isReady) {
    return (
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-[#f2f4ef] p-8">
              <div className="space-y-4">
                <div className="premium-skeleton animate-shimmer h-5 w-40 rounded-xl" />
                <div className="premium-skeleton animate-shimmer h-12 w-full rounded-xl" />
                <div className="premium-skeleton animate-shimmer h-12 w-full rounded-xl" />
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
      <div className="bg-white p-10 text-center shadow-card">
        <p className="font-[family:var(--font-heading)] text-3xl">Your cart is calm for now.</p>
        <p className="mt-3 text-sm leading-6 text-bark/75">
          Add a few plants to start building your collection.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex bg-[#516448] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white"
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
    <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <section>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-[family:var(--font-heading)] text-2xl italic text-[#486730]">01</span>
            <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-[#191c1a]">
              Contact Information
            </h2>
          </div>
          <div className="bg-[#f2f4ef] p-8">
            {status !== "authenticated" ? (
              <>
                {renderInput(
                  "guest-email",
                  "Email Address",
                  customerEmail,
                  (value) => setCustomerEmail(value),
                  "botanist@archive.org",
                  "email"
                )}
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#474747]/65">
                  <p>We&apos;ll use this email for confirmation and delivery updates.</p>
                  <button
                    type="button"
                    onClick={() => void signIn()}
                    className="whitespace-nowrap font-semibold uppercase tracking-[0.18em] text-[#486730]"
                  >
                    Sign In Instead
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {renderInput(
                  "account-email",
                  "Email Address",
                  contactEmail,
                  () => {},
                  "",
                  "email",
                  true
                )}
                <p className="text-sm leading-6 text-[#474747]/72">
                  Your account email will be used for confirmations, tracking updates, and
                  follow-up care guidance.
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-[family:var(--font-heading)] text-2xl italic text-[#486730]">02</span>
            <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-[#191c1a]">
              Shipping Address
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-[#f2f4ef] p-8">
            <div className="col-span-1">
              {renderInput(
                "first-name",
                "First Name",
                firstName,
                (value) => updateRecipientName(value, lastName),
                "Linden"
              )}
            </div>
            <div className="col-span-1">
              {renderInput(
                "last-name",
                "Last Name",
                lastName,
                (value) => updateRecipientName(firstName, value),
                "Green"
              )}
            </div>
            <div className="col-span-2">
              {renderInput(
                "street-address",
                "Address",
                address.streetAddress,
                (value) => updateAddress("streetAddress", value),
                "12 Arboretum Way"
              )}
            </div>
            <div className="col-span-1">
              {renderInput("city", "City", address.city, (value) => updateAddress("city", value), "Portland")}
            </div>
            <div className="col-span-1">
              {renderInput(
                "postal-code",
                "Postal Code",
                address.postalCode,
                (value) => updateAddress("postalCode", value),
                "97201"
              )}
            </div>
            <div className="col-span-1">
              {renderInput(
                "state",
                "State",
                address.state,
                (value) => updateAddress("state", value),
                "Oregon"
              )}
            </div>
            <div className="col-span-1">
              {renderInput(
                "phone",
                "Phone Number",
                address.phoneNumber,
                (value) => updateAddress("phoneNumber", value),
                "(555) 123-4567",
                "tel"
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-center gap-4">
            <span className="font-[family:var(--font-heading)] text-2xl italic text-[#486730]">03</span>
            <h2 className="font-[family:var(--font-heading)] text-2xl font-bold text-[#191c1a]">
              Shipping Method
            </h2>
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => void handleCheckShipping()}
              disabled={isCheckingShipping || address.postalCode.trim().length < 3}
              className="border border-[#c6c6c6]/20 px-5 py-3 font-[family:var(--font-body)] text-xs font-semibold uppercase tracking-[0.18em] text-[#191c1a] transition hover:border-[#516448] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCheckingShipping ? "Checking..." : "Check Delivery"}
            </button>

            {shippingError ? <p className="text-sm text-[#ba1a1a]">{shippingError}</p> : null}

            {isCheckingShipping ? (
              <ShippingQuoteSkeleton />
            ) : shippingQuote ? (
              <div className="space-y-4">
                {shippingQuote.weatherWarning ? (
                  <div className="border border-[#ba1a1a]/20 bg-[#ffdad6]/35 p-4 text-sm text-[#474747]">
                    <p>{shippingQuote.weatherWarning}</p>
                    {shippingQuote.suggestedExtra ? (
                      <p className="mt-2 font-medium text-[#ba1a1a]">
                        Suggested add-on: {shippingQuote.suggestedExtra.name}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {shippingQuote.restrictionMessage ? (
                  <div className="border border-[#ba1a1a]/20 bg-[#ffdad6]/35 p-4 text-sm text-[#474747]">
                    {shippingQuote.restrictionMessage}
                  </div>
                ) : (
                  <>
                    {shippingQuote.availableMethods.map((method, index) => {
                      const selected = selectedShippingType === method.type;

                      return (
                        <label
                          key={method.type}
                          className={`flex cursor-pointer items-center justify-between border p-6 ${
                            selected
                              ? "border-[#c6c6c6]/20 bg-white"
                              : "border-[#c6c6c6]/10 bg-[#ecefea] opacity-70"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                selected ? "border-[#486730]" : "border-[#c6c6c6]"
                              }`}
                            >
                              {selected ? <div className="h-2.5 w-2.5 rounded-full bg-[#486730]" /> : null}
                            </div>
                            <input
                              type="radio"
                              name="shipping-method"
                              checked={selected}
                              onChange={() => setSelectedShippingType(method.type)}
                              className="sr-only"
                            />
                            <div>
                              <p className="font-[family:var(--font-body)] text-sm font-semibold text-[#191c1a]">
                                {method.label}
                              </p>
                              <p className="text-xs italic text-[#777777]">
                                {index === 0
                                  ? "2-3 Business Days • Temperature Controlled"
                                  : "5-7 Business Days"}
                              </p>
                            </div>
                          </div>
                          <span className="font-[family:var(--font-heading)] text-[#486730]">
                            {formatCurrency(method.cost)}
                          </span>
                        </label>
                      );
                    })}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <aside className="lg:col-span-5 lg:sticky lg:top-32">
        <div className="bg-[#ecefea] p-8 lg:p-12">
          <h3 className="mb-10 font-[family:var(--font-heading)] text-3xl font-bold text-[#486730]">
            Summary
          </h3>

          <div className="mb-12 space-y-8">
            {cartItems.map((item) => {
              const bundlePlant = item.kind === "bundle" ? getPlantById(item.bundle.plantId) : null;
              const summaryName =
                item.kind === "bundle" ? `${bundlePlant?.name ?? "Bundle"} Bundle` : item.name;
              const meta =
                item.kind === "bundle"
                  ? `Archival Selection • ${item.bundle.plantVariantSize}`
                  : `${item.condition === "fragile" ? "Journal Entry" : "Archival Selection"} • ${item.size.replace(/"/g, "")}`;

              return (
                <div key={`summary-${item.cartKey}`} className="flex gap-6 items-center">
                  <div className="h-24 w-20 overflow-hidden bg-[#e1e3de]">
                    <img src={item.image} alt={summaryName} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-[family:var(--font-heading)] text-lg text-[#191c1a]">{summaryName}</p>
                    <p className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#777777]">
                      {meta}
                    </p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm font-medium text-[#191c1a]">
                        {formatCurrency(item.unitPrice)}
                      </span>
                      <span className="text-sm italic text-[#486730]">x{item.quantity}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.cartKey, Math.max(1, item.quantity - 1))}
                        className="h-6 w-6 border border-[#c6c6c6]/25 text-xs text-[#516448] disabled:opacity-35"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="h-6 w-6 border border-[#c6c6c6]/25 text-xs text-[#516448]"
                      >
                        +
                      </button>
                      {item.kind === "bundle" ? (
                        <button
                          type="button"
                          onClick={() => handleEditBundle(item.cartKey)}
                          className="ml-2 text-[10px] uppercase tracking-[0.16em] text-[#777777] hover:text-[#486730]"
                        >
                          Edit Bundle
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartKey)}
                        className="text-[10px] uppercase tracking-[0.16em] text-[#777777] hover:text-[#486730]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 border-t border-[#486730]/10 pt-8">
            <div className="flex items-center justify-between text-sm">
              <span className="font-[family:var(--font-body)] uppercase tracking-[0.18em] text-[#777777]">
                Subtotal
              </span>
              <span className="font-medium text-[#191c1a]">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-[family:var(--font-body)] uppercase tracking-[0.18em] text-[#777777]">
                Shipping
              </span>
              <span className="font-medium text-[#191c1a]">{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#486730]/20 pt-4 text-xl font-bold">
              <span className="font-[family:var(--font-heading)] italic text-[#486730]">Total Due</span>
              <span className="font-[family:var(--font-heading)] text-[#486730]">
                {formatCurrency(checkoutTotal)}
              </span>
            </div>
          </div>

          {checkoutError ? <p className="mt-4 text-sm text-[#ba1a1a]">{checkoutError}</p> : null}

          <button
            type="button"
            onClick={() => void handleCheckout()}
            disabled={
              isCheckingOut ||
              !shippingQuote ||
              !selectedShippingType ||
              Boolean(shippingQuote.restrictionMessage)
            }
            className="mt-10 w-full bg-[#516448] py-5 font-[family:var(--font-heading)] text-lg font-bold text-white transition-colors duration-300 hover:bg-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCheckingOut ? "Redirecting To Checkout..." : "Complete Archive Purchase"}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[#777777] opacity-60">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em]">
              Secured Encryption Applied
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
