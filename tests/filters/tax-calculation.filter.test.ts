import { TaxCalculationFilter } from "../../src/filters/pricing/tax-calculation.filter";

describe("TaxCalculationFilter", () => {
  const filter = new TaxCalculationFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [], status: "pending" as const, createdAt: new Date(), subtotal: 1000, discounts: [{ type: "membership" as const, value: 100, description: "" }] };
  const context = { products: [], customer: { id: "c1", name: "Test", email: "a@a.com", membership: "gold" as const, address: { street: "A", city: "B", country: "C", state: "D", zipCode: "E" }, isActive: true } };

  it("should calculate taxes and total", async () => {
    const result = await filter.process({ ...baseOrder }, context);
    expect(result.success).toBe(true);
    expect(result.order.taxes).toBeCloseTo(72); // (1000-100)*0.08
    expect(result.order.total).toBeCloseTo(972);
  });

  it("should handle missing discounts", async () => {
    const result = await filter.process({ ...baseOrder, discounts: undefined }, context);
    expect(result.success).toBe(true);
    expect(result.order.taxes).toBeCloseTo(80);
    expect(result.order.total).toBeCloseTo(1080);
  });

  it("should fail if customer address is incomplete", async () => {
    const contextIncomplete = { ...context, customer: { ...context.customer, address: { street: "", city: "", country: "", state: "", zipCode: "" } } };
    const result = await filter.process({ ...baseOrder }, contextIncomplete);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/address is incomplete/);
  });

  it("should fail if customer or address is missing", async () => {
    const result = await filter.process({ ...baseOrder }, { products: [] });
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/address not found/);
  });
});
