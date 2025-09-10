import { ProductRepository } from "../../src/repositories/product.repository";
import { products } from "../../src/data/products";

describe("ProductRepository", () => {
  beforeEach(() => {
    products.length = 0;
    products.push({ id: "p1", name: "Test", price: 10, stock: 5 });
  });

  it("should get all products", () => {
    const all = ProductRepository.getAll();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe("p1");
  });

  it("should get product by id", () => {
    const found = ProductRepository.getById("p1");
    expect(found).toBeDefined();
    expect(found!.id).toBe("p1");
  });

  it("should return undefined for non-existent id", () => {
    const found = ProductRepository.getById("not-exist");
    expect(found).toBeUndefined();
  });
});
