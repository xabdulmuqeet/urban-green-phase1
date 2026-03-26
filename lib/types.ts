export type Product = {
  id: string;
  name: string;
  price: number;
  tag: string;
  category: string;
  description: string;
  sizes: string[];
  care: {
    light: string;
    water: string;
    details: string;
  };
  images: string[];
};

export type InstagramPost = {
  id: string;
  title: string;
  image: string;
};
