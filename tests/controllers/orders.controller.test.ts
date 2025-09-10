import { process, getOrderStatus } from "../../src/controllers/orders.controller";
import { OrderService } from "../../src/services/order.service";
import { Request, Response } from "express";

jest.mock("../../src/services/order.service");

describe("orders.controller - process", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let orderService: any;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    req = { body: { customerId: "cust-001", items: [{ productId: "prod-101", quantity: 2 }] } };
    res = { status: statusMock };
    orderService = { processOrder: jest.fn(), getOrderStatus: jest.fn() };
  });

  it("should process order and return result", async () => {
    orderService.processOrder.mockResolvedValue({
      success: true,
      finalOrder: { id: "1", status: "completed" },
      filterResults: [{ name: "A", success: true, errors: [], warnings: [] }],
      executionTime: 10,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: true,
        finalOrder: { id: "1", status: "completed" },
        filterResults: [expect.objectContaining({ name: "A", success: true })],
        executionTime: 10,
      }),
    });
  });
});

describe("orders.controller - getOrderStatus", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let orderService: any;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    req = { params: { id: "order-1" } };
    res = { status: statusMock };
    orderService = { getOrderStatus: jest.fn() };
  });

  it("should return order status and filterResults", () => {
    const order = { id: "order-1", status: "completed" };
    const filterResults = [{ name: "A", success: true, errors: [], warnings: [] }];
    orderService.getOrderStatus.mockReturnValue({ order, filterResults });
    getOrderStatus(orderService)(req as Request, res as Response);
    expect(orderService.getOrderStatus).toHaveBeenCalledWith("order-1");
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "completed",
      filterResults: [
        {
          name: "A",
          success: true,
          errors: [],
          warning: [],
        },
      ],
    });
  });

  it("should handle error thrown by getOrderStatus", () => {
    orderService.getOrderStatus.mockImplementation(() => { throw new Error("Order not found"); });
    // Simulate Express error handling
    try {
      getOrderStatus(orderService)(req as Request, res as Response);
    } catch (e) {
      expect((e as Error).message).toBe("Order not found");
    }
  });
});
