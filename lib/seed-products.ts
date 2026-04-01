import catalogData from "@/data/catalog.json";
import { ProductModel } from "@/models/Product";

export async function seedProductsIfEmpty() {
  const products = [
    ...catalogData.plants.map((plant) => ({
      ...plant,
      description: plant.description,
      displayCategory: plant.displayCategory
    })),
    ...catalogData.pots,
    ...catalogData.extras
  ];

  await ProductModel.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { id: product.id },
        update: { $set: product },
        upsert: true
      }
    }))
  );
}
