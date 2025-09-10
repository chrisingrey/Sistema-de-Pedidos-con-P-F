import { CustomerRepository } from "../../src/repositories/customer.repository";
import { customers } from "../../src/data/customers";

describe("CustomerRepository", () => {
  beforeEach(() => {
    customers.length = 0;
    customers.push({
      id: "c1",
      name: "Test",
      email: "test@test.com",
      membership: "gold",
      address: { street: "", city: "", country: "", state: "", zipCode: "" },
      isActive: true
    });
  });

  it("should create a customer", () => {
    const newCustomer = {
      id: "c2",
      name: "Test2",
      email: "test2@test.com",
      membership: "silver" as const,
      address: { street: "", city: "", country: "", state: "", zipCode: "" },
      isActive: true
    };
    const result = CustomerRepository.create(newCustomer);
    expect(customers).toContain(result);
  });

  it("should find a customer by id", () => {
    const found = CustomerRepository.findById("c1");
    expect(found).toBeDefined();
    expect(found!.id).toBe("c1");
  });

  it("should return undefined for non-existent id", () => {
    const found = CustomerRepository.findById("not-exist");
    expect(found).toBeUndefined();
  });
});
