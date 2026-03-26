import productData from "@/data/products.json";
import instagramData from "@/data/instagram.json";
import type { InstagramPost, Product } from "@/lib/types";

export const products = productData as Product[];
export const instagramPosts = instagramData as InstagramPost[];

export const getFeaturedProducts = () => products.slice(0, 3);

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);
