export type PlantSizeLabel = "Small" | "Medium" | "Large";
export type ProductSizeLabel = '4"' | '6"' | '10"';

export type CatalogPlant = {
  id: string;
  name: string;
  type: "plant";
  category: "plant";
  plantSize: PlantSizeLabel;
  sizes: ProductSizeLabel[];
  prices: Record<ProductSizeLabel, number>;
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

export type Product = CatalogPlant;

export type InstagramPost = {
  id: string;
  title: string;
  image: string;
};

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  condition: Product["condition"];
  unitPrice: number;
  quantity: number;
};

export type ProductSelection = {
  size: string;
  quantity: number;
};
