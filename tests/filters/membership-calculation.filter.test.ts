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
    expect(result.errors.length).toBe(0);
  });

  it("should fail if no customer", async () => {
    const result = await filter.process({ ...baseOrder }, { products: [] });
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/Customer not found/);
  });

  it("should fail if subtotal is missing", async () => {
    const result = await filter.process({ ...baseOrder, subtotal: undefined }, { ...context });
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/Order subtotal is required/);
  });

  it("should fail if customer has no valid membership", async () => {
    const contextNoMem = { customer: { ...context.customer, membership: "bronze" as const }, products: [] };
    const result = await filter.process({ ...baseOrder }, contextNoMem);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toMatch(/does not have a valid membership/);
  });
});
