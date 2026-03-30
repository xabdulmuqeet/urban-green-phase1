import { Schema, model, models, type InferSchemaType } from "mongoose";

const variantSchema = new Schema(
  {
    id: { type: String, required: true },
    size: { type: String, enum: ['4"', '6"', '10"'], required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["plant", "pot", "extra"], required: true, index: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    displayCategory: { type: String },
    collections: [{ type: String }],
    plantSize: { type: String, enum: ["Small", "Medium", "Large"] },
    fits: [{ type: String, enum: ["Small", "Medium", "Large"] }],
    condition: { type: String, enum: ["hardy", "fragile"] },
    tag: { type: String },
    variants: [variantSchema],
    price: { type: Number },
    images: [{ type: String, required: true }],
    care: {
      light: { type: String },
      watering: { type: String },
      commonIssues: { type: String }
    }
  },
  {
    timestamps: true
  }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

export const ProductModel = models.Product || model("Product", productSchema);
