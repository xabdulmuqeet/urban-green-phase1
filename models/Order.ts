import { Schema, model, models, type InferSchemaType } from "mongoose";

const orderItemSchema = new Schema(
  {
    type: { type: String, enum: ["single", "bundle"], required: true },
    productId: { type: String },
    size: { type: String, enum: ['4"', '6"', '10"'] },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, min: 0 },
    bundle: {
      plant: { type: String },
      pot: { type: String },
      extras: [{ type: String }],
      discount: { type: Number, min: 0 },
      totalPrice: { type: Number, min: 0 }
    }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = models.Order || model("Order", orderSchema);
