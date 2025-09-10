import { TaxCalculationFilter } from "../../src/filters/pricing/tax-calculation.filter";

describe("TaxCalculationFilter", () => {
  const filter = new TaxCalculationFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [], status: "pending" as const, createdAt: new Date(), subtotal: 1000, discounts: [{ type: "membership" as const, value: 100, description: "" }] };
  const context = { products: [] };

  it("should calculate taxes and total", async () => {
  const result = await filter.process({ ...baseOrder }, context);
    expect(result.order.taxes).toBeCloseTo(72); // (1000-100)*0.08
    expect(result.order.total).toBeCloseTo(972);
  });

  it("should handle missing discounts", async () => {
  const result = await filter.process({ ...baseOrder, discounts: undefined }, context);
    expect(result.order.taxes).toBeCloseTo(80);
    expect(result.order.total).toBeCloseTo(1080);
  });
});
