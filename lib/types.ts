export type ProductSize = {
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  type: "hardy" | "fragile";
  tag: string;
  category: string;
  description: string;
  sizes: ProductSize[];
  care: {
    light: string;
    watering: string;
    commonIssues: string;
  };
  images: string[];
};

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
  type: Product["type"];
  unitPrice: number;
  quantity: number;
};

export type ProductSelection = {
  size: string;
  quantity: number;
};
