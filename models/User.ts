import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    emailVerified: { type: Date, default: null },
    cart: {
      type: [Schema.Types.Mixed],
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
