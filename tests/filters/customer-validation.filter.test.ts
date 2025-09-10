import { CustomerValidationFilter } from "../../src/filters/validation/customer-validation.filter";
import { CustomerRepository } from "../../src/repositories/customer.repository";

jest.mock("../../src/repositories/customer.repository");

describe("CustomerValidationFilter", () => {
  const filter = new CustomerValidationFilter();
  const baseOrder = { id: "1", customerId: "c1", items: [], status: "pending" as const, createdAt: new Date() };
  const context = { products: [] };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should succeed if customer exists and is active", async () => {
    (CustomerRepository.findById as jest.Mock).mockReturnValue({ isActive: true });
    const result = await filter.process(baseOrder, context);
    expect(result.success).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it("should fail if customer does not exist", async () => {
    (CustomerRepository.findById as jest.Mock).mockReturnValue(undefined);
    const result = await filter.process(baseOrder, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("does not exist");
  });

  it("should fail if customer is not active", async () => {
    (CustomerRepository.findById as jest.Mock).mockReturnValue({ isActive: false });
    const result = await filter.process(baseOrder, context);
    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain("not active");
  });
});
