import Product from "../models/product.model";

export const products: Product[] = [
  { id: "prod-101", name: "Laptop", price: 1200, stock: 50 },
  { id: "prod-102", name: "Mouse", price: 25, stock: 200 },
  { id: "prod-sinprecio", name: "Producto sin precio", price: undefined as any, stock: 10 },
  { id: "prod-sinstock", name: "Producto sin stock", price: 100, stock: 0 },
];
