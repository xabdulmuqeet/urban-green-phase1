import type { ApiCartItem, ShippingMethodOption, ShippingMethodType, ShippingQuoteResponse } from "@/lib/api-types";
import { calculateCartTotal, getProductsMap } from "@/lib/commerce";
import { lookupWeatherByPostalCode } from "@/lib/services/weather-service";

const STORE_LAT = Number(process.env.STORE_LAT ?? "40.7128");
const STORE_LON = Number(process.env.STORE_LON ?? "-74.0060");
const LOCAL_DELIVERY_RADIUS_MILES = Number(process.env.LOCAL_DELIVERY_RADIUS_MILES ?? "20");
const WHITE_GLOVE_DELIVERY_FEE = Number(process.env.WHITE_GLOVE_DELIVERY_FEE ?? "15");
const HARDY_SHIPPING_FEE = Number(process.env.HARDY_SHIPPING_FEE ?? "25");

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceMiles(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}

export type ShippingValidationResult = {
  quote: ShippingQuoteResponse;
  selectedMethod: ShippingMethodOption;
};

export async function buildShippingQuote(items: ApiCartItem[], postalCode: string): Promise<ShippingQuoteResponse> {
  const weather = await lookupWeatherByPostalCode(postalCode);
  const productIds = new Set<string>();

  items.forEach((item) => {
    if (item.type === "single") {
      productIds.add(item.productId);
      return;
    }

    productIds.add(item.bundle.plant);
    productIds.add(item.bundle.pot);
    item.bundle.extras.forEach((extraId) => productIds.add(extraId));
  });

  const productsById = await getProductsMap([...productIds]);
  const containsFragile = items.some((item) => {
    if (item.type === "single") {
      return productsById.get(item.productId)?.type === "plant" && productsById.get(item.productId)?.condition === "fragile";
    }

    return productsById.get(item.bundle.plant)?.type === "plant" && productsById.get(item.bundle.plant)?.condition === "fragile";
  });

  const distanceMiles = getDistanceMiles(STORE_LAT, STORE_LON, weather.latitude, weather.longitude);
  const isLocalDeliveryZone = distanceMiles <= LOCAL_DELIVERY_RADIUS_MILES;
  const subtotal = calculateCartTotal(items);
  const weatherWarning =
    typeof weather.temperatureF === "number" && weather.temperatureF < 40
      ? `Destination forecast is ${Math.round(weather.temperatureF)}°F. We recommend adding a Heat Pack.`
      : null;
  const suggestedExtra = weatherWarning
    ? {
        id: "heat-pack",
        name: "Heat Pack"
      }
    : null;

  if (isLocalDeliveryZone) {
    const availableMethods: ShippingMethodOption[] = [
      { type: "white_glove", label: "White Glove Delivery", cost: WHITE_GLOVE_DELIVERY_FEE },
      { type: "local_pickup", label: "Local Pickup", cost: 0 }
    ];

    return {
      postalCode,
      isLocalDeliveryZone,
      distanceMiles,
      availableMethods,
      restrictionMessage: null,
      weatherWarning,
      suggestedExtra,
      subtotal,
      shippingCost: availableMethods[0].cost,
      totalAmount: subtotal + availableMethods[0].cost,
      selectedMethod: availableMethods[0].type
    };
  }

  if (containsFragile) {
    return {
      postalCode,
      isLocalDeliveryZone,
      distanceMiles,
      availableMethods: [],
      restrictionMessage:
        "This destination is outside our 20-mile white glove radius, so fragile plants and fragile bundles cannot be shipped.",
      weatherWarning,
      suggestedExtra,
      subtotal,
      shippingCost: 0,
      totalAmount: subtotal,
      selectedMethod: null
    };
  }

  const hardyShipping: ShippingMethodOption = {
    type: "hardy_shipping",
    label: "Hardy Plant Shipping",
    cost: HARDY_SHIPPING_FEE
  };

  return {
    postalCode,
    isLocalDeliveryZone,
    distanceMiles,
    availableMethods: [hardyShipping],
    restrictionMessage: null,
    weatherWarning,
    suggestedExtra,
    subtotal,
    shippingCost: hardyShipping.cost,
    totalAmount: subtotal + hardyShipping.cost,
    selectedMethod: hardyShipping.type
  };
}

export async function validateShippingSelection(
  items: ApiCartItem[],
  postalCode: string,
  shippingType: ShippingMethodType
): Promise<ShippingValidationResult> {
  const quote = await buildShippingQuote(items, postalCode);

  if (quote.restrictionMessage) {
    throw new Error(quote.restrictionMessage);
  }

  const selectedMethod = quote.availableMethods.find((method) => method.type === shippingType);

  if (!selectedMethod) {
    throw new Error("Selected shipping method is not available for this destination.");
  }

  return {
    quote: {
      ...quote,
      shippingCost: selectedMethod.cost,
      totalAmount: quote.subtotal + selectedMethod.cost,
      selectedMethod: selectedMethod.type
    },
    selectedMethod
  };
}
