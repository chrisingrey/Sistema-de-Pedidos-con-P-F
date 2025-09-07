import { products } from "../data/products";
import Product from "../models/product.model";

export const ProductRepository = {
  getAll: (): Product[] => {
    return products;
  },

  // A method to get a single product by its ID.
  getById: (id: string): Product | undefined => {
    const product = products.find((p) => p.id == id);
    return product;
  },
};
