export type PlantSizeLabel = "Small" | "Medium" | "Large";
export type ProductSizeLabel = '4"' | '6"' | '10"';
export type ShopFilterKey = "all" | "statement" | "trees" | "low-light";

export type ProductVariant = {
  id: string;
  size: ProductSizeLabel;
  sku: string;
  price: number;
  inStock: boolean;
};

export type CatalogPlant = {
  id: string;
  name: string;
  type: "plant";
  category: "plant";
  displayCategory: string;
  collections: Exclude<ShopFilterKey, "all">[];
  plantSize: PlantSizeLabel;
  variants: ProductVariant[];
  condition: "hardy" | "fragile";
  tag: string;
  description: string;
  care: {
    light: string;
    watering: string;
    commonIssues: string;
  };
  images: string[];
};

export type CatalogPot = {
  id: string;
  name: string;
  type: "pot";
  category: "pot";
  fits: PlantSizeLabel[];
  price: number;
  images: string[];
};

export type CatalogExtra = {
  id: string;
  name: string;
  type: "extra";
  category: "extra";
  price: number;
  images: string[];
};

export type CatalogData = {
  plants: CatalogPlant[];
  pots: CatalogPot[];
  extras: CatalogExtra[];
};

export type Product = Omit<CatalogPlant, "category"> & {
  category: string;
  catalogCategory: CatalogPlant["category"];
  sizes: ProductSizeLabel[];
  prices: Record<ProductSizeLabel, number>;
};

export type InstagramPost = {
  id: string;
  title: string;
  image: string;
};

export type ProductCartItem = {
  kind: "product";
  cartKey: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: ProductSizeLabel;
  condition: Product["condition"];
  unitPrice: number;
  quantity: number;
};

export type BundleCartItem = {
  kind: "bundle";
  cartKey: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  bundle: {
    plantId: string;
    plantName: string;
    plantSize: Product["plantSize"];
    potId: string;
    potName: string;
    extras: Array<{
      id: string;
      name: string;
      price: number;
    }>;
    discount: number;
  };
};

export type CartItem = ProductCartItem | BundleCartItem;

export type ProductSelection = {
  size: ProductSizeLabel | "";
  quantity: number;
};

export type BundleSelection = {
  step: number;
  plantId: string | null;
  potId: string | null;
  extraIds: string[];
};
