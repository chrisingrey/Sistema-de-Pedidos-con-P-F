import { PriceCalculationFilter } from "../../src/filters/pricing/price-calculation.filter";

describe("PriceCalculationFilter", () => {
  const filter = new PriceCalculationFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [{ productId: "p1", quantity: 2 }], status: "pending" as const, createdAt: new Date() };
  const context = { products: [{ id: "p1", name: "Test", price: 10, stock: 5 }] };

  it("should calculate subtotal and set unit/total price", async () => {
    const result = await filter.process({ ...baseOrder, items: [{ productId: "p1", quantity: 2 }] }, context);
    expect(result.success).toBe(true);
    expect(result.order.subtotal).toBe(20);
    expect(result.order.items[0].unitPrice).toBe(10);
    expect(result.order.items[0].totalPrice).toBe(20);
    expect(result.errors.length).toBe(0);
  });

  it("should fail if item has no matching product", async () => {
    const result = await filter.process({ ...baseOrder, items: [{ productId: "not-exist", quantity: 2 }] }, context);
    expect(result.success).toBe(false);
    expect(result.order.subtotal).toBeUndefined();
    expect(result.errors[0]).toMatch(/Product not found/);
  });

  it("should fail if product has no price", async () => {
    const contextWithNoPrice = { products: [{ id: "p2", name: "NoPrice", price: undefined as any, stock: 5 }] };
    const result = await filter.process({ ...baseOrder, items: [{ productId: "p2", quantity: 1 }] }, contextWithNoPrice);
    expect(result.success).toBe(false);
    expect(result.order.subtotal).toBeUndefined();
    expect(result.errors[0]).toMatch(/does not have a valid price/);
  });
});
