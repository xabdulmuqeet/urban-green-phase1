import type { MetadataRoute } from "next";
import { getAllPlants } from "@/lib/data";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:8090"
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const products = getAllPlants();

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/shop` },
    ...products.map((product) => ({
      url: `${baseUrl}/shop/${product.id}`
    }))
  ];
}
