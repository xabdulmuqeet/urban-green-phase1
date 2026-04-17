import catalogData from "@/data/catalog.json";
import instagramData from "@/data/instagram.json";
import type {
  CatalogData,
  CatalogExtra,
  CatalogPot,
  InstagramPost,
  PlantSizeLabel,
  Product,
  ShopConditionFilter,
  ProductSizeLabel,
  ShopPriceFilter,
  ProductVariant,
  ShopFilterKey,
  ShopSizeFilter,
  ShopSortKey
} from "@/lib/types";

export const catalog = catalogData as CatalogData;
export const instagramPosts = instagramData as InstagramPost[];

export type CatalogItem = Product | CatalogPot | CatalogExtra;

const SHOP_FILTER_OPTIONS: Array<{ key: ShopFilterKey; label: string }> = [
  { key: "all", label: "All Species" },
  { key: "statement", label: "Statement" },
  { key: "low-light", label: "Low Light" },
  { key: "tropicals", label: "Tropicals" },
  { key: "rare-finds", label: "Rare Finds" }
];

const SHOP_SORT_OPTIONS: Array<{ key: ShopSortKey; label: string }> = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-low", label: "Price: Low to High" },
  { key: "price-high", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" }
];

const SHOP_CONDITION_OPTIONS: Array<{ key: ShopConditionFilter; label: string }> = [
  { key: "all", label: "All Conditions" },
  { key: "hardy", label: "Hardy" },
  { key: "fragile", label: "Fragile" }
];

const SHOP_SIZE_OPTIONS: Array<{ key: ShopSizeFilter; label: string }> = [
  { key: "all", label: "All Sizes" },
  { key: "Small", label: "Small" },
  { key: "Medium", label: "Medium" },
  { key: "Large", label: "Large" }
];

const SHOP_PRICE_OPTIONS: Array<{ key: ShopPriceFilter; label: string }> = [
  { key: "all", label: "All Prices" },
  { key: "under-80", label: "Under $80" },
  { key: "80-120", label: "$80 - $120" },
  { key: "120-plus", label: "$120+" }
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
export const getAllCatalogItems = (): CatalogItem[] => [
  ...getAllPlants(),
  ...getAllPots(),
  ...getAllExtras()
];
export const getPlantById = (id: string): Product | undefined =>
  getAllPlants().find((plant) => plant.id === id);
export const getPotById = (id: string): CatalogPot | undefined =>
  getAllPots().find((pot) => pot.id === id);
export const getExtraById = (id: string): CatalogExtra | undefined =>
  getAllExtras().find((extra) => extra.id === id);
export const getCatalogItemById = (id: string): CatalogItem | undefined =>
  getAllCatalogItems().find((item) => item.id === id);
export const getExtrasByIds = (extraIds: string[]): CatalogExtra[] =>
  extraIds
    .map((extraId) => getExtraById(extraId))
    .filter((extra): extra is CatalogExtra => Boolean(extra));
export const getPotsByPlantSize = (plantSize: PlantSizeLabel): CatalogPot[] =>
  getAllPots().filter((pot) => pot.fits.includes(plantSize));

export const products: Product[] = getAllPlants();

export const getFeaturedProducts = () => getAllPlants().slice(0, 4);
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
export const getShopSortOptions = () => SHOP_SORT_OPTIONS;
export const getShopConditionOptions = () => SHOP_CONDITION_OPTIONS;
export const getShopSizeOptions = () => SHOP_SIZE_OPTIONS;
export const getShopPriceOptions = () => SHOP_PRICE_OPTIONS;

export const getShopFilterFromSearchParam = (value?: string): ShopFilterKey =>
  SHOP_FILTER_OPTIONS.some((option) => option.key === value) ? (value as ShopFilterKey) : "all";

export const getShopSortFromSearchParam = (value?: string): ShopSortKey =>
  SHOP_SORT_OPTIONS.some((option) => option.key === value) ? (value as ShopSortKey) : "featured";

export const getShopConditionFromSearchParam = (value?: string): ShopConditionFilter =>
  SHOP_CONDITION_OPTIONS.some((option) => option.key === value)
    ? (value as ShopConditionFilter)
    : "all";

export const getShopSizeFromSearchParam = (value?: string): ShopSizeFilter =>
  SHOP_SIZE_OPTIONS.some((option) => option.key === value) ? (value as ShopSizeFilter) : "all";

export const getShopPriceFromSearchParam = (value?: string): ShopPriceFilter =>
  SHOP_PRICE_OPTIONS.some((option) => option.key === value) ? (value as ShopPriceFilter) : "all";

type ShopQuery = {
  filter: ShopFilterKey;
  search?: string;
  condition?: ShopConditionFilter;
  size?: ShopSizeFilter;
  price?: ShopPriceFilter;
  sort?: ShopSortKey;
};

export const getPlantsForShopQuery = ({
  filter,
  search = "",
  condition = "all",
  size = "all",
  price = "all",
  sort = "featured"
}: ShopQuery): Product[] => {
  let plants = getAllPlants();

  if (filter !== "all") {
    plants = plants.filter((plant) => plant.collections.includes(filter));
  }

  const normalizedSearch = search.trim().toLowerCase();

  if (normalizedSearch) {
    plants = plants.filter((plant) =>
      [
        plant.name,
        plant.description,
        plant.category,
        plant.tag,
        ...plant.collections
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }

  if (condition !== "all") {
    plants = plants.filter((plant) => plant.condition === condition);
  }

  if (size !== "all") {
    plants = plants.filter((plant) => plant.plantSize === size);
  }

  if (price !== "all") {
    plants = plants.filter((plant) => {
      const startingPrice = getStartingPrice(plant);
      if (price === "under-80") {
        return startingPrice < 80;
      }
      if (price === "80-120") {
        return startingPrice >= 80 && startingPrice <= 120;
      }
      return startingPrice > 120;
    });
  }

  if (sort === "newest") {
    return [...plants].reverse();
  }

  if (sort === "price-low") {
    return [...plants].sort((left, right) => getStartingPrice(left) - getStartingPrice(right));
  }

  if (sort === "price-high") {
    return [...plants].sort((left, right) => getStartingPrice(right) - getStartingPrice(left));
  }

  if (sort === "name") {
    return [...plants].sort((left, right) => left.name.localeCompare(right.name));
  }

  return plants;
};
