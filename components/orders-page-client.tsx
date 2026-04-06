"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { fetchOrdersFromApi, lookupGuestOrderFromApi } from "@/lib/api-client";
import { getExtrasByIds, getPlantById, getPotById } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { OrderResponse } from "@/lib/api-types";

type OrderVisualAsset =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "count";
      label: string;
    };

function formatOrderDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));
}

function getOrderItemName(item: OrderResponse["items"][number]) {
  if (item.type === "single") {
    return getPlantById(item.productId)?.name ?? item.productId;
  }

  const plant = getPlantById(item.bundle.plant);
  return plant ? `The ${plant.name} Archive` : "Custom Plant Archive";
}

function getOrderTitle(order: OrderResponse) {
  const names = order.items.map(getOrderItemName);

  if (names.length === 0) {
    return "Collection Archive";
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  return `${names[0]} +${names.length - 1} Items`;
}

function getOrderAssets(order: OrderResponse): OrderVisualAsset[] {
  const images: Array<{ src: string; alt: string }> = [];

  order.items.forEach((item) => {
    if (item.type === "single") {
      const plant = getPlantById(item.productId);
      if (plant?.images[0]) {
        images.push({ src: plant.images[0], alt: plant.name });
      }
      return;
    }

    const plant = getPlantById(item.bundle.plant);
    const pot = getPotById(item.bundle.pot);
    const extras = getExtrasByIds(item.bundle.extras);

    if (plant?.images[0]) {
      images.push({ src: plant.images[0], alt: plant.name });
    }

    if (pot?.images[0]) {
      images.push({ src: pot.images[0], alt: pot.name });
    }

    extras.forEach((extra) => {
      if (extra.images[0]) {
        images.push({ src: extra.images[0], alt: extra.name });
      }
    });
  });

  const deduped = images.filter(
    (image, index, current) => current.findIndex((item) => item.src === image.src) === index
  );

  if (deduped.length <= 2) {
    return deduped.map((image) => ({ type: "image", ...image }));
  }

  return [
    { type: "image", ...deduped[0] },
    { type: "count", label: `+${deduped.length - 1} Items` }
  ];
}

function getOrderBadge(order: OrderResponse, index: number) {
  if (index === 0) {
    return {
      label: "Arriving in 2 Days",
      className: "bg-[#bbdf9c] text-[#486730]"
    };
  }

  return {
    label: "Archived in Collection",
    className: "bg-[#e1e3de] text-[#474747]"
  };
}

function getOrderDetails(order: OrderResponse) {
  const details: string[] = [];

  order.items.forEach((item) => {
    if (item.type === "single") {
      const plant = getPlantById(item.productId);
      details.push(
        `${plant?.name ?? item.productId} · ${item.size} · Qty ${item.quantity} · ${formatCurrency(item.price * item.quantity)}`
      );
      return;
    }

    const plant = getPlantById(item.bundle.plant);
    const pot = getPotById(item.bundle.pot);
    const extras = getExtrasByIds(item.bundle.extras);
    const extrasLabel = extras.length > 0 ? extras.map((extra) => extra.name).join(", ") : "No extras";

    details.push(
      `${plant?.name ?? "Custom Plant"} · ${item.bundle.size} · ${pot?.name ?? "Pot"} · ${extrasLabel} · Qty ${item.quantity}`
    );
  });

  if (order.shippingType) {
    details.push(`Shipping · ${order.shippingType.replace(/_/g, " ")} · ${formatCurrency(order.shippingCost ?? 0)}`);
  }

  if (order.deliveryAddress) {
    details.push(
      `Delivery · ${order.deliveryAddress.recipientName}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.postalCode}`
    );
  }

  return details;
}

function renderOrderArticle(order: OrderResponse, index: number, isLast: boolean) {
  const badge = getOrderBadge(order, index);
  const assets = getOrderAssets(order);
  const details = getOrderDetails(order);

  return (
    <article key={order.id} className="group">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`px-3 py-1 font-[family:var(--font-body)] text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="text-sm font-light text-[#474747]">{order.orderNumber}</span>
        </div>
        <h2 className="max-w-4xl font-[family:var(--font-heading)] text-4xl leading-tight text-[#191c1a] md:text-[4rem]">
          {getOrderTitle(order)}
        </h2>
        <p className="font-[family:var(--font-body)] text-base font-light text-[#474747]">
          Ordered on {formatOrderDate(order.createdAt)} • Total {formatCurrency(order.totalAmount)}
        </p>

        <div className="grid gap-8 border border-[#ecefea] bg-[#fdfdf9] p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              {details.map((detail) => (
                <p
                  key={detail}
                  className="font-[family:var(--font-body)] text-sm leading-7 text-[#474747]"
                >
                  {detail}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              <button
                type="button"
                className="bg-[#516448] px-8 py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#486730]"
              >
                Track Shipment
              </button>
            </div>
          </div>

          <div className="flex shrink-0 justify-start -space-x-6 md:justify-end">
            {assets.map((asset, assetIndex) =>
              asset.type === "image" ? (
                <div
                  key={`${order.id}-asset-${assetIndex}`}
                  className="h-44 w-32 overflow-hidden bg-[#ecefea] ring-8 ring-[#fdfdf9]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.src}
                    alt={asset.alt}
                    className="h-full w-full object-cover grayscale-[0.2] transition-all duration-500 group-hover:grayscale-0"
                  />
                </div>
              ) : (
                <div
                  key={`${order.id}-asset-${assetIndex}`}
                  className="flex h-44 w-32 items-center justify-center bg-[#e7e9e4] px-3 text-center font-[family:var(--font-heading)] text-xl italic text-[#486730] ring-8 ring-[#fdfdf9]"
                >
                  {asset.label}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {!isLast ? <div className="mt-10 h-px w-full bg-[#ecefea]" /> : null}
    </article>
  );
}

function renderLoadingState() {
  return (
    <section className="space-y-20">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse space-y-8 pb-16">
          <div className="flex items-start justify-between gap-8">
            <div className="space-y-4">
              <div className="h-7 w-56 bg-[#ecefea]" />
              <div className="h-14 w-[32rem] max-w-full bg-[#ecefea]" />
              <div className="h-6 w-72 bg-[#ecefea]" />
              <div className="h-32 w-[36rem] max-w-full bg-[#ecefea]" />
            </div>
            <div className="flex -space-x-6">
              <div className="h-44 w-32 bg-[#ecefea] ring-8 ring-[#f8faf5]" />
              <div className="h-44 w-32 bg-[#ecefea] ring-8 ring-[#f8faf5]" />
            </div>
          </div>
          <div className="h-14 w-52 bg-[#ecefea]" />
          <div className="h-px w-full bg-[#ecefea]" />
        </div>
      ))}
    </section>
  );
}

function renderAuthPrompt(
  guestEmail: string,
  guestOrderNumber: string,
  guestLookupError: string,
  isLookingUpGuestOrder: boolean,
  onGuestEmailChange: (value: string) => void,
  onGuestOrderNumberChange: (value: string) => void,
  onSubmit: () => void
) {
  return (
    <section className="space-y-12">
      <div className="border border-[#ecefea] bg-[#fdfdf9] p-10">
        <h2 className="font-[family:var(--font-heading)] text-4xl text-[#191c1a]">
          Sign in to access your full archive.
        </h2>
        <p className="mt-4 max-w-2xl font-[family:var(--font-body)] text-base leading-8 text-[#474747]">
          Your saved orders, delivery records, and botanical history live inside your account.
        </p>
        <button
          type="button"
          onClick={() => void signIn()}
          className="mt-8 bg-[#516448] px-8 py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#486730]"
        >
          Sign In
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        className="border border-[#ecefea] bg-[#fdfdf9] p-10"
      >
        <h3 className="font-[family:var(--font-heading)] text-3xl text-[#191c1a]">Guest order lookup</h3>
        <p className="mt-3 max-w-2xl font-[family:var(--font-body)] text-base leading-8 text-[#474747]">
          Enter the email used at checkout and your order number to reopen a guest archive.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <input
            type="email"
            value={guestEmail}
            onChange={(event) => onGuestEmailChange(event.target.value)}
            placeholder="Email address"
            className="h-14 border-0 border-b border-[#c6c6c6]/30 bg-transparent px-0 font-[family:var(--font-body)] text-base text-[#191c1a] outline-none transition placeholder:text-[#777777] focus:border-[#486730]"
          />
          <input
            type="text"
            value={guestOrderNumber}
            onChange={(event) => onGuestOrderNumberChange(event.target.value)}
            placeholder="Order number"
            className="h-14 border-0 border-b border-[#c6c6c6]/30 bg-transparent px-0 font-[family:var(--font-body)] text-base uppercase text-[#191c1a] outline-none transition placeholder:text-[#777777] focus:border-[#486730]"
          />
        </div>

        {guestLookupError ? (
          <p className="mt-5 font-[family:var(--font-body)] text-sm text-[#ba1a1a]">
            {guestLookupError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLookingUpGuestOrder}
          className="mt-8 border border-[#c6c6c6]/40 px-8 py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-[#191c1a] transition hover:border-[#486730] hover:text-[#486730] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLookingUpGuestOrder ? "Finding Order..." : "View Order"}
        </button>
      </form>
    </section>
  );
}

export function OrdersPageClient() {
  const { status } = useSession();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestOrderNumber, setGuestOrderNumber] = useState("");
  const [guestLookupError, setGuestLookupError] = useState("");
  const [isLookingUpGuestOrder, setIsLookingUpGuestOrder] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadOrders = async () => {
      try {
        const response = await fetchOrdersFromApi();
        if (!isCancelled) {
          setOrders(response.orders);
        }
      } catch (caughtError) {
        if (!isCancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "Failed to fetch orders.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isCancelled = true;
    };
  }, [status]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    [orders]
  );

  const handleGuestLookup = () => {
    setIsLookingUpGuestOrder(true);
    setGuestLookupError("");

    void lookupGuestOrderFromApi(guestEmail.trim(), guestOrderNumber.trim().toUpperCase())
      .then((response) => {
        setOrders([response.order]);
      })
      .catch((caughtError) => {
        setOrders([]);
        setGuestLookupError(
          caughtError instanceof Error ? caughtError.message : "Failed to look up order."
        );
      })
      .finally(() => setIsLookingUpGuestOrder(false));
  };

  return (
    <>
      <main className="mx-auto max-w-screen-2xl px-[80px] pb-24 pt-40">
        <header className="mb-20">
          <h1 className="font-[family:var(--font-heading)] text-5xl font-bold tracking-[-0.04em] text-[#486730]">
            Order History
          </h1>
          <p className="mt-4 font-[family:var(--font-body)] text-sm uppercase tracking-[0.2em] text-[#474747]">
            The Urban Green Archive
          </p>
        </header>

        {status === "loading" || isLoading ? (
            renderLoadingState()
          ) : error ? (
            <section>
              <div className="border border-[#ecefea] bg-[#fdfdf9] p-10">
                <h2 className="font-[family:var(--font-heading)] text-4xl text-[#191c1a]">
                  We could not load your archive.
                </h2>
                <p className="mt-4 font-[family:var(--font-body)] text-base leading-8 text-[#474747]">
                  {error}
                </p>
              </div>
            </section>
          ) : status !== "authenticated" && sortedOrders.length === 0 ? (
            renderAuthPrompt(
              guestEmail,
              guestOrderNumber,
              guestLookupError,
              isLookingUpGuestOrder,
              setGuestEmail,
              setGuestOrderNumber,
              handleGuestLookup
            )
          ) : sortedOrders.length === 0 ? (
            <section>
              <div className="border border-[#ecefea] bg-[#fdfdf9] p-10">
                <h2 className="font-[family:var(--font-heading)] text-4xl text-[#191c1a]">
                  No orders yet.
                </h2>
                <p className="mt-4 font-[family:var(--font-body)] text-base leading-8 text-[#474747]">
                  Begin your collection and your archive will start recording every delivery here.
                </p>
                <Link
                  href="/shop"
                  className="mt-8 inline-flex bg-[#516448] px-8 py-4 font-[family:var(--font-body)] text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#486730]"
                >
                  Browse Plants
                </Link>
              </div>
            </section>
          ) : (
            <section className="space-y-10">
              {sortedOrders.map((order, index) =>
                renderOrderArticle(order, index, index === sortedOrders.length - 1)
              )}
            </section>
          )}
      </main>

      <nav className="fixed bottom-0 left-0 z-40 flex h-16 w-full items-center justify-around border-t border-[#ecefea]/40 bg-[#f8faf5] px-4 shadow-[0_-4px_20px_rgba(25,28,26,0.06)] md:hidden">
        {[
          { href: "/shop", icon: "local_florist", label: "Gallery" },
          { href: "/shop", icon: "search", label: "Search" },
          { href: "/orders", icon: "inventory_2", label: "Orders", active: true },
          { href: "/wishlist", icon: "person", label: "Profile" }
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center ${
              item.active ? "scale-110 font-bold text-[#486730]" : "text-[#516448]/50"
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={item.active ? { fontVariationSettings: '"FILL" 1, "wght" 300, "GRAD" 0, "opsz" 24' } : undefined}
            >
              {item.icon}
            </span>
            <span className="mt-1 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.05em]">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="fixed bottom-24 right-8 md:bottom-12 md:right-12">
        <Link
          href="/bundle"
          className="group flex h-14 w-14 items-center justify-center bg-[#486730] text-white shadow-[0_20px_30px_rgba(72,103,48,0.25)] transition-transform hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl transition-transform group-hover:rotate-12">
            add
          </span>
          <span className="pointer-events-none absolute right-16 whitespace-nowrap bg-[#191c1a] px-3 py-1 font-[family:var(--font-body)] text-[10px] uppercase tracking-[0.18em] text-[#f8faf5] opacity-0 transition-opacity group-hover:opacity-100">
            Start New Collection
          </span>
        </Link>
      </div>
    </>
  );
}
