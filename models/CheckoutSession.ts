import { Schema, model, models, type InferSchemaType } from "mongoose";

const checkoutItemSchema = new Schema(
  {
    type: { type: String, enum: ["single", "bundle"], required: true },
    productId: { type: String },
    size: { type: String, enum: ['4"', '6"', '10"'] },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, min: 0 },
    bundle: {
      plant: { type: String },
      size: { type: String, enum: ['4"', '6"', '10"'] },
      pot: { type: String },
      extras: [{ type: String }],
      discount: { type: Number, min: 0 },
      totalPrice: { type: Number, min: 0 }
    }
  },
  { _id: false }
);

const deliveryAddressSchema = new Schema(
  {
    recipientName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    deliveryNotes: { type: String, default: "" }
  },
  { _id: false }
);

const checkoutSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true, sparse: true },
    customerEmail: { type: String, required: true },
    items: { type: [checkoutItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    subtotalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: { type: deliveryAddressSchema, required: true },
    destinationPostalCode: { type: String, required: true },
    shippingType: {
      type: String,
      enum: ["white_glove", "local_pickup", "hardy_shipping"],
      required: true
    },
    shippingCost: { type: Number, required: true, min: 0 },
    weatherWarning: { type: String, default: null },
    checkoutToken: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["pending", "completed", "expired", "failed"],
      required: true,
      default: "pending",
      index: true
    },
    stripeSessionId: { type: String, unique: true, index: true, sparse: true }
  },
  {
    timestamps: true
  }
);

export type CheckoutSessionDocument = InferSchemaType<typeof checkoutSessionSchema>;

export const CheckoutSessionModel =
  models.CheckoutSession || model("CheckoutSession", checkoutSessionSchema);
