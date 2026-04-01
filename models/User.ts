import { Schema, model, models, type InferSchemaType } from "mongoose";

const cartItemSchema = new Schema(
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

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, default: null },
    image: { type: String },
    emailVerified: { type: Date, default: null },
    wishlist: {
      type: [{ type: String }],
      default: []
    },
    cart: {
      type: [cartItemSchema],
      default: []
    }
  },
  {
    collection: "users",
    timestamps: { createdAt: true, updatedAt: true }
  }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const UserModel = models.User || model("User", userSchema);
