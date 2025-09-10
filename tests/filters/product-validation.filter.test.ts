import { ProductValidationFilter } from "../../src/filters/validation/product-validation.filter";

describe("ProductValidationFilter", () => {
  const filter = new ProductValidationFilter();
  const context = { products: [{ id: "p1", name: "Test", price: 10, stock: 5 }] };
  const baseOrder = { id: "1", customerId: "c1", items: [{ productId: "p1", quantity: 1 }], status: "pending" as const, createdAt: new Date() };

  it("should succeed if product exists and has enough stock", async () => {
  const result = await filter.process(baseOrder, context);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("should fail if product does not exist", async () => {
  const result = await filter.process({ ...baseOrder, items: [{ productId: "not-exist", quantity: 1 }] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("does not exist");
  });

  it("should fail if not enough stock", async () => {
  const result = await filter.process({ ...baseOrder, items: [{ productId: "p1", quantity: 10 }] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("Insufficient stock");
  });
});
