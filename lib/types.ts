export type PlantSizeLabel = "Small" | "Medium" | "Large";
export type ProductSizeLabel = '4"' | '6"' | '10"';
export type ShopFilterKey =
  | "all"
  | "statement"
  | "low-light"
  | "tropicals"
  | "rare-finds";
export type ShopSortKey = "featured" | "newest" | "price-low" | "price-high" | "name";
export type ShopConditionFilter = "all" | "hardy" | "fragile";
export type ShopSizeFilter = "all" | PlantSizeLabel;
export type ShopPriceFilter = "all" | "under-80" | "80-120" | "120-plus";

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
  image: string;
  quantity: number;
  unitPrice: number;
  bundle: {
    plantId: string;
    plantSize: Product["plantSize"];
    plantVariantSize: ProductSizeLabel;
    potId: string;
    extraIds: string[];
    discount: number;
  };
};

export type CartItem = ProductCartItem | BundleCartItem;

export type CheckoutDraft = {
  postalCode: string;
  shippingType: import("@/lib/api-types").ShippingMethodType | null;
};

export type ProductSelection = {
  size: ProductSizeLabel | "";
  quantity: number;
};

export type BundleSelection = {
  step: number;
  plantId: string | null;
  plantVariantSize: ProductSizeLabel | null;
  potId: string | null;
  extraIds: string[];
  quantity: number;
  editingCartKey: string | null;
};
