import catalogData from "@/data/catalog.json";
import { ProductModel } from "@/models/Product";

export async function seedProductsIfEmpty() {
  const count = await ProductModel.countDocuments();

  if (count > 0) {
    return;
  }

  const products = [
    ...catalogData.plants.map((plant) => ({
      ...plant,
      description: plant.description,
      displayCategory: plant.displayCategory
    })),
    ...catalogData.pots,
    ...catalogData.extras
  ];

  await ProductModel.insertMany(products);
}
