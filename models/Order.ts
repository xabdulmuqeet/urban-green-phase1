import { Schema, model, models, type HydratedDocument, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
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

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true, sparse: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerEmail: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    deliveryAddress: { type: deliveryAddressSchema, required: true },
    destinationPostalCode: { type: String, required: true },
    shippingType: {
      type: String,
      enum: ["white_glove", "local_pickup", "hardy_shipping"],
      required: true
    },
    shippingCost: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["paid"], required: true, default: "paid" },
    stripeSessionId: { type: String, index: true, sparse: true },
    confirmationEmailSentAt: { type: Date, default: null },
    followUpEmailScheduledFor: { type: Date, default: null, index: true },
    followUpEmailSentAt: { type: Date, default: null }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;
export type OrderHydratedDocument = HydratedDocument<OrderDocument>;

export const OrderModel = models.Order || model("Order", orderSchema);
