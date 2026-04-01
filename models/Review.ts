import { Schema, model, models, type InferSchemaType } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", trim: true, maxlength: 1000 }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;

export const ReviewModel = models.Review || model("Review", reviewSchema);
