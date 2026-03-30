import { z } from "zod";

export const productTypeSchema = z.enum(["plant", "pot", "extra"]);
export const productSizeSchema = z.enum(['4"', '6"', '10"']);

export const singleCartItemSchema = z.object({
  type: z.literal("single"),
  productId: z.string().min(1),
  size: productSizeSchema,
  quantity: z.number().int().min(1),
  price: z.number().nonnegative()
});

export const bundleCartItemSchema = z.object({
  type: z.literal("bundle"),
  quantity: z.number().int().min(1),
  bundle: z.object({
    plant: z.string().min(1),
    pot: z.string().min(1),
    extras: z.array(z.string().min(1)).default([]),
    discount: z.number().nonnegative(),
    totalPrice: z.number().nonnegative()
  })
});

export const apiCartItemSchema = z.discriminatedUnion("type", [
  singleCartItemSchema,
  bundleCartItemSchema
]);

export const saveCartSchema = z.object({
  items: z.array(apiCartItemSchema)
});

export const createOrderSchema = z.object({
  items: z.array(apiCartItemSchema).optional()
});
