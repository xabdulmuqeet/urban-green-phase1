import type { ApiCartItem } from "@/lib/api-types";
import { connectToDatabase } from "@/lib/mongoose";
import { seedProductsIfEmpty } from "@/lib/seed-products";
import { ProductModel } from "@/models/Product";

type ProductRecord = {
  id: string;
  type: "plant" | "pot" | "extra";
  name?: string;
  plantSize?: "Small" | "Medium" | "Large";
  fits?: Array<"Small" | "Medium" | "Large">;
  condition?: "hardy" | "fragile";
  variants?: Array<{
    id: string;
    size: '4"' | '6"' | '10"';
    price: number;
    inStock: boolean;
  }>;
  price?: number;
};

export async function getProductsMap(productIds: string[]) {
  await connectToDatabase();
  await seedProductsIfEmpty();
  const products = await ProductModel.find({ id: { $in: productIds } }).lean<ProductRecord[]>();

  return new Map(products.map((product) => [product.id, product]));
}

export async function normalizeCartItems(items: ApiCartItem[]) {
  const ids = new Set<string>();

  items.forEach((item) => {
    if (item.type === "single") {
      ids.add(item.productId);
      return;
    }

    ids.add(item.bundle.plant);
    ids.add(item.bundle.pot);
    item.bundle.extras.forEach((extraId) => ids.add(extraId));
  });

  const productsById = await getProductsMap([...ids]);

  return items.map((item) => {
    if (item.type === "single") {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found.`);
      }

      if (product.type !== "plant") {
        throw new Error(`Single item ${item.productId} is not a plant.`);
      }

      const variant = product.variants?.find((entry) => entry.size === item.size);

      if (!variant) {
        throw new Error(`Variant ${item.size} not found for product ${item.productId}.`);
      }

      if (!variant.inStock) {
        throw new Error(`Variant ${item.size} for product ${item.productId} is out of stock.`);
      }

      return {
        type: "single" as const,
        productId: product.id,
        size: variant.size,
        quantity: item.quantity,
        price: variant.price
      };
    }

    const plant = productsById.get(item.bundle.plant);
    const pot = productsById.get(item.bundle.pot);
    const extras = item.bundle.extras.map((extraId) => productsById.get(extraId));

    if (!plant || plant.type !== "plant") {
      throw new Error("Bundle must include a valid plant.");
    }

    if (!pot || pot.type !== "pot") {
      throw new Error("Bundle must include a valid pot.");
    }

    if (extras.some((extra) => !extra || extra.type !== "extra")) {
      throw new Error("Bundle extras must all be valid extras.");
    }

    if (plant.plantSize && pot.fits?.length && !pot.fits.includes(plant.plantSize)) {
      throw new Error(`Pot ${pot.id} does not fit plant size ${plant.plantSize}.`);
    }

    const plantVariant =
      plant.variants?.find((variant) => variant.size === item.bundle.size && variant.inStock) ??
      plant.variants?.find((variant) => variant.size === item.bundle.size) ??
      null;

    if (!plantVariant) {
      throw new Error(`Bundle plant size ${item.bundle.size} is not available for ${plant.id}.`);
    }

    if (!plantVariant.inStock) {
      throw new Error(`Bundle plant size ${item.bundle.size} for ${plant.id} is out of stock.`);
    }

    const plantPrice = plantVariant?.price ?? 0;
    const potPrice = pot.price ?? 0;
    const extrasPrice = extras.reduce((sum, extra) => sum + (extra?.price ?? 0), 0);
    const subtotal = plantPrice + potPrice + extrasPrice;
    const discount = extras.length > 0 ? subtotal * 0.1 : 0;
    const totalPrice = subtotal - discount;

    return {
      type: "bundle" as const,
      quantity: item.quantity,
      bundle: {
        plant: plant.id,
        size: plantVariant.size,
        pot: pot.id,
        extras: extras.map((extra) => extra!.id),
        discount,
        totalPrice
      }
    };
  });
}

function getSingleItemKey(item: Extract<ApiCartItem, { type: "single" }>) {
  return `single:${item.productId}:${item.size}`;
}

function getBundleItemKey(item: Extract<ApiCartItem, { type: "bundle" }>) {
  return `bundle:${item.bundle.plant}:${item.bundle.size}:${item.bundle.pot}:${[...item.bundle.extras].sort().join(",")}`;
}

export function mergeCartItems(items: ApiCartItem[]) {
  const mergedItems = new Map<string, ApiCartItem>();

  items.forEach((item) => {
    if (item.type === "single") {
      const key = getSingleItemKey(item);
      const existing = mergedItems.get(key);

      if (existing && existing.type === "single") {
        mergedItems.set(key, {
          ...existing,
          quantity: existing.quantity + item.quantity
        });
        return;
      }

      mergedItems.set(key, item);
      return;
    }

    const normalizedExtras = [...item.bundle.extras].sort();
    const key = getBundleItemKey({
      ...item,
      bundle: {
        ...item.bundle,
        extras: normalizedExtras
      }
    });
    const existing = mergedItems.get(key);

    if (existing && existing.type === "bundle") {
      mergedItems.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        bundle: {
          ...existing.bundle,
          extras: normalizedExtras
        }
      });
      return;
    }

    mergedItems.set(key, {
      ...item,
      bundle: {
        ...item.bundle,
        extras: normalizedExtras
      }
    });
  });

  return [...mergedItems.values()];
}

export async function normalizeAndMergeCartItems(items: ApiCartItem[]) {
  const normalizedItems = await normalizeCartItems(items);
  return mergeCartItems(normalizedItems);
}

export function calculateCartTotal(items: ApiCartItem[]) {
  return items.reduce((sum, item) => {
    if (item.type === "single") {
      return sum + item.price * item.quantity;
    }

    return sum + item.bundle.totalPrice * item.quantity;
  }, 0);
}
