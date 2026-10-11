import { products as source } from "../public/catalog.js";

export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  color: string;
  swatch: string;
  sizes: string[];
  sheet: string;
  position: string;
  tag: string;
  description: string;
};

export const products = source as CatalogProduct[];
export const findProduct = (id: string) => products.find(product => product.id === id);
