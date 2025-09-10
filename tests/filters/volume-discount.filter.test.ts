import { VolumeDiscountFilter } from "../../src/filters/pricing/volume-discount.filter";

describe("VolumeDiscountFilter", () => {
  const filter = new VolumeDiscountFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [], status: "pending" as const, createdAt: new Date(), subtotal: 2000 };
  const context = { products: [] };

  it("should add discount for >10 items", async () => {
  const order = { ...baseOrder, items: Array(11).fill({ productId: "p1", quantity: 1 }) };
    const result = await filter.process(order, context);
    expect(result.order.discounts?.some(d => d.description.includes(">10 items"))).toBe(true);
  });

  it("should add discount for >50 items", async () => {
  const order = { ...baseOrder, items: Array(51).fill({ productId: "p1", quantity: 1 }) };
    const result = await filter.process(order, context);
    expect(result.order.discounts?.some(d => d.description.includes(">50 items"))).toBe(true);
  });

  it("should add discount for subtotal >1000", async () => {
  const order = { ...baseOrder, items: [{ productId: "p1", quantity: 1 }], subtotal: 2001 };
    const result = await filter.process(order, context);
    expect(result.order.discounts?.some(d => d.description.includes(">$1000"))).toBe(true);
  });

  it("should add discount for subtotal >5000", async () => {
  const order = { ...baseOrder, items: [{ productId: "p1", quantity: 1 }], subtotal: 5001 };
    const result = await filter.process(order, context);
    expect(result.order.discounts?.some(d => d.description.includes(">$5000"))).toBe(true);
  });

  it("should not add discount if no conditions met", async () => {
  const order = { ...baseOrder, items: [{ productId: "p1", quantity: 1 }], subtotal: 100 };
    const result = await filter.process(order, context);
    expect(result.order.discounts?.length || 0).toBe(0);
  });
});
