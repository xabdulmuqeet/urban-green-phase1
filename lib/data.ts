import catalogData from "@/data/catalog.json";
import instagramData from "@/data/instagram.json";
import type {
  CatalogData,
  CatalogExtra,
  CatalogPot,
  InstagramPost,
  PlantSizeLabel,
  Product,
  ProductSizeLabel,
  ProductVariant,
  ShopFilterKey
} from "@/lib/types";

export const catalog = catalogData as CatalogData;
export const instagramPosts = instagramData as InstagramPost[];

const SHOP_FILTER_OPTIONS: Array<{ key: ShopFilterKey; label: string }> = [
  { key: "all", label: "All Plants" },
  { key: "statement", label: "Statement" },
  { key: "trees", label: "Trees" },
  { key: "low-light", label: "Low Light" }
];

function normalizeProduct(plant: CatalogData["plants"][number]): Product {
  const sizes = plant.variants.map((variant) => variant.size);
  const prices = plant.variants.reduce<Record<ProductSizeLabel, number>>(
    (accumulator, variant) => ({
      ...accumulator,
      [variant.size]: variant.price
    }),
    {} as Record<ProductSizeLabel, number>
  );

  return {
    ...plant,
    category: plant.displayCategory,
    catalogCategory: plant.category,
    sizes,
    prices
  };
}

export const getAllPlants = (): Product[] => catalog.plants.map(normalizeProduct);
export const getAllPots = (): CatalogPot[] => catalog.pots;
export const getAllExtras = (): CatalogExtra[] => catalog.extras;
export const getPlantById = (id: string): Product | undefined =>
  getAllPlants().find((plant) => plant.id === id);
export const getPotById = (id: string): CatalogPot | undefined =>
  getAllPots().find((pot) => pot.id === id);
export const getExtraById = (id: string): CatalogExtra | undefined =>
  getAllExtras().find((extra) => extra.id === id);
export const getExtrasByIds = (extraIds: string[]): CatalogExtra[] =>
  extraIds
    .map((extraId) => getExtraById(extraId))
    .filter((extra): extra is CatalogExtra => Boolean(extra));
export const getPotsByPlantSize = (plantSize: PlantSizeLabel): CatalogPot[] =>
  getAllPots().filter((pot) => pot.fits.includes(plantSize));

export const products: Product[] = getAllPlants();

export const getFeaturedProducts = () => getAllPlants().slice(0, 3);
export const getProductById = (id: string) => getPlantById(id);

export const getVariantBySize = (
  product: Product,
  size: ProductSizeLabel
): ProductVariant | undefined => product.variants.find((variant) => variant.size === size);

export const getDefaultSize = (product: Product): ProductSizeLabel =>
  product.variants.find((variant) => variant.size === '6"' && variant.inStock)?.size ??
  product.variants.find((variant) => variant.inStock)?.size ??
  product.variants[0]?.size ??
  '6"';

export const getPriceForSize = (product: Product, size: ProductSizeLabel) =>
  getVariantBySize(product, size)?.price ?? product.prices[size];

export const getStartingPrice = (product: Product) =>
  getPriceForSize(product, product.sizes[0]);

export const getShopFilterOptions = () => SHOP_FILTER_OPTIONS;

export const getShopFilterFromSearchParam = (value?: string): ShopFilterKey =>
  SHOP_FILTER_OPTIONS.some((option) => option.key === value) ? (value as ShopFilterKey) : "all";

export const getPlantsForShopFilter = (filter: ShopFilterKey): Product[] => {
  if (filter === "all") {
    return getAllPlants();
  }

  return getAllPlants().filter((plant) => plant.collections.includes(filter));
};
