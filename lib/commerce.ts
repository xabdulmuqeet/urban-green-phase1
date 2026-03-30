import type { ApiCartItem } from "@/lib/api-types";
import { connectToDatabase } from "@/lib/mongoose";
import { seedProductsIfEmpty } from "@/lib/seed-products";
import { ProductModel } from "@/models/Product";

type ProductRecord = {
  id: string;
  type: "plant" | "pot" | "extra";
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

    const plantVariant = plant.variants?.find((variant) => variant.inStock) ?? plant.variants?.[0];
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
        pot: pot.id,
        extras: extras.map((extra) => extra!.id),
        discount,
        totalPrice
      }
    };
  });
}

export function calculateCartTotal(items: ApiCartItem[]) {
  return items.reduce((sum, item) => {
    if (item.type === "single") {
      return sum + item.price * item.quantity;
    }

    return sum + item.bundle.totalPrice * item.quantity;
  }, 0);
}
