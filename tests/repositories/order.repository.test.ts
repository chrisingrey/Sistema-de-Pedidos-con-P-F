import { OrderRepository } from "../../src/repositories/order.repository";

describe("OrderRepository", () => {
  beforeEach(() => {
    // Clear the internal map
    (OrderRepository as any).orders = new Map();
  });

  it("should create and find an order", () => {
    const order = {
      id: "o1",
      customerId: "c1",
      items: [],
      status: "pending" as const,
      createdAt: new Date()
    };
    OrderRepository.create(order);
    const found = OrderRepository.findById("o1");
    expect(found).toEqual(order);
  });

  it("should return undefined for non-existent order", () => {
    const found = OrderRepository.findById("not-exist");
    expect(found).toBeUndefined();
  });
});
