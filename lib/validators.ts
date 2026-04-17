import { z } from "zod";

export const productTypeSchema = z.enum(["plant", "pot", "extra"]);
export const productSizeSchema = z.enum(['4"', '6"', '10"']);
export const shippingMethodSchema = z.enum(["white_glove", "local_pickup", "hardy_shipping"]);

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
    size: productSizeSchema,
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

export const checkoutAddressSchema = z.object({
  recipientName: z.string().trim().min(2),
  streetAddress: z.string().trim().min(5),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  postalCode: z.string().trim().min(3),
  phoneNumber: z.string().trim().min(7),
  deliveryNotes: z.string().trim().max(300).optional().or(z.literal(""))
});

export const createCheckoutSchema = z.object({
  items: z.array(apiCartItemSchema).optional(),
  address: checkoutAddressSchema,
  shippingType: shippingMethodSchema,
  customerEmail: z.string().trim().email().optional()
});

export const shippingQuoteSchema = z.object({
  items: z.array(apiCartItemSchema).optional(),
  postalCode: z.string().trim().min(3),
  city: z.string().trim().min(2).optional(),
  state: z.string().trim().min(2).optional(),
  countryCode: z.string().trim().length(2).optional()
});

export const guestOrderLookupSchema = z.object({
  email: z.string().trim().email(),
  orderNumber: z.string().trim().min(3)
});

export const createReviewSchema = z.object({
  productId: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().default("")
});
