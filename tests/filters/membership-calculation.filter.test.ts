import { MembershipDiscountFilter } from "../../src/filters/pricing/membership-calculation.filter";

describe("MembershipDiscountFilter", () => {
  const filter = new MembershipDiscountFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [], status: "pending" as const, createdAt: new Date(), subtotal: 1000 };
  const context = { customer: { id: "c1", name: "Test", email: "a@a.com", membership: "gold" as const, address: { street: "", city: "", country: "", state: "", zipCode: "" }, isActive: true }, products: [] };

  it("should add membership discount for gold", async () => {
  const result = await filter.process({ ...baseOrder }, { ...context });
    expect(result.success).toBe(true);
    expect(result.order.discounts?.[0].type).toBe("membership");
    expect(result.order.discounts?.[0].value).toBe(150);
  });

  it("should not add discount if no customer", async () => {
  const result = await filter.process({ ...baseOrder }, { products: [] });
    expect(result.order.discounts).toBeUndefined();
  });

  it("should not add discount if subtotal is missing", async () => {
  const result = await filter.process({ ...baseOrder, subtotal: undefined }, { ...context });
    expect(result.order.discounts).toBeUndefined();
  });
});
