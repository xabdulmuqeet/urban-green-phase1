import catalogData from "@/data/catalog.json";
import instagramData from "@/data/instagram.json";
import type {
  CatalogData,
  CatalogExtra,
  CatalogPlant,
  CatalogPot,
  InstagramPost,
  Product,
  ProductSizeLabel
} from "@/lib/types";

export const catalog = catalogData as CatalogData;
export const instagramPosts = instagramData as InstagramPost[];

export const getAllPlants = (): CatalogPlant[] => catalog.plants;
export const getAllPots = (): CatalogPot[] => catalog.pots;
export const getAllExtras = (): CatalogExtra[] => catalog.extras;

export const products: Product[] = getAllPlants();

export const getFeaturedProducts = () => getAllPlants().slice(0, 3);

export const getProductById = (id: string) =>
  getAllPlants().find((product) => product.id === id);

export const getPriceForSize = (product: Product, size: ProductSizeLabel) =>
  product.prices[size];

export const getStartingPrice = (product: Product) =>
  getPriceForSize(product, product.sizes[0]);
