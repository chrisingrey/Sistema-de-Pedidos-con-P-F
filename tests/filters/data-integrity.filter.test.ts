import { DataIntegrityFilter } from "../../src/filters/validation/data-integrity.filter";

describe("DataIntegrityFilter", () => {
  const filter = new DataIntegrityFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [{ productId: "p1", quantity: 1 }], status: "pending" as const, createdAt: new Date() };
  const context = { products: [] };

  it("should succeed for valid order", async () => {
  const result = await filter.process(baseOrder, context);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("should fail if no customerId", async () => {
  // @ts-expect-error
  const result = await filter.process({ ...baseOrder, customerId: undefined }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("customer ID");
  });

  it("should fail if no items", async () => {
  const result = await filter.process({ ...baseOrder, items: [] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("at least one item");
  });

  it("should fail if item missing productId", async () => {
  // @ts-expect-error
  const result = await filter.process({ ...baseOrder, items: [{ quantity: 1 }] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("product id");
  });

  it("should fail if item quantity is not a number", async () => {
  // @ts-expect-error
  const result = await filter.process({ ...baseOrder, items: [{ productId: "p1", quantity: "a" }] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("quantity must be a number");
  });

  it("should fail if item quantity <= 0", async () => {
  const result = await filter.process({ ...baseOrder, items: [{ productId: "p1", quantity: 0 }] }, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("greater than 0");
  });
});
