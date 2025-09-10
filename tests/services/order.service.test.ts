import { OrderService } from "../../src/services/order.service";
import { OrderRepository } from "../../src/repositories/order.repository";
import { PipelineService } from "../../src/services/pipeline.service";
import OrderPipeline from "../../src/pipelines/order-pipeline";
import Order from "../../src/models/order.model";

jest.mock("../../src/repositories/order.repository");
jest.mock("../../src/services/pipeline.service");

describe("OrderService", () => {
  let validationPipeline: OrderPipeline;
  let pricingPipeline: OrderPipeline;
  let orderService: OrderService;
  let baseOrderData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    validationPipeline = {
      filters: [],
      addFilter: jest.fn(),
      removeFilter: jest.fn(),
      process: jest.fn(),
    };
    pricingPipeline = {
      filters: [],
      addFilter: jest.fn(),
      removeFilter: jest.fn(),
      process: jest.fn(),
    };
    orderService = new OrderService(validationPipeline, pricingPipeline);
    baseOrderData = {
      customerId: "cust-001",
      items: [
        { productId: "prod-101", quantity: 2 },
        { productId: "prod-102", quantity: 1 },
      ],
    };
    (PipelineService.getPipelineConfig as jest.Mock).mockReturnValue({ enabledFilters: [] });
  });


  it("should process order successfully when all pipelines succeed", async () => {
    (validationPipeline.process as jest.Mock).mockResolvedValue({
      success: true,
      finalOrder: { ...baseOrderData },
      filterResults: [{ name: "ValidationFilter", success: true }],
      failedAt: null,
      executionTime: 10,
    });
    (pricingPipeline.process as jest.Mock).mockResolvedValue({
      success: true,
      finalOrder: { ...baseOrderData },
      filterResults: [{ name: "PricingFilter", success: true }],
      failedAt: null,
      executionTime: 5,
    });
    (OrderRepository.create as jest.Mock).mockReturnValue(undefined);
    const result = await orderService.processOrder(baseOrderData);
    expect(result.success).toBe(true);
    expect(OrderRepository.create).toHaveBeenCalled();
    expect(result.finalOrder.status).toBe("completed");
    expect(result.filterResults).toEqual([
      { name: "ValidationFilter", success: true },
      { name: "PricingFilter", success: true },
    ]);
    expect(result.executionTime).toBe(15);
  });


  it("should reject order if validation pipeline fails", async () => {
    (validationPipeline.process as jest.Mock).mockResolvedValue({
      success: false,
      finalOrder: { ...baseOrderData },
      filterResults: [{ name: "ValidationFilter", success: false }],
      failedAt: "ValidationFilter",
      executionTime: 7,
    });
    (OrderRepository.create as jest.Mock).mockReturnValue(undefined);
    const result = await orderService.processOrder(baseOrderData);
    expect(result.success).toBe(false);
    expect(OrderRepository.create).toHaveBeenCalled();
    expect(result.finalOrder.status).toBe("rejected");
    expect(result.filterResults).toEqual([
      { name: "ValidationFilter", success: false },
    ]);
    expect(result.executionTime).toBe(7);
  });


  it("should reject order if pricing pipeline fails", async () => {
    (validationPipeline.process as jest.Mock).mockResolvedValue({
      success: true,
      finalOrder: { ...baseOrderData },
      filterResults: [{ name: "ValidationFilter", success: true }],
      failedAt: null,
      executionTime: 8,
    });
    (pricingPipeline.process as jest.Mock).mockResolvedValue({
      success: false,
      finalOrder: { ...baseOrderData },
      filterResults: [{ name: "PricingFilter", success: false }],
      failedAt: "PricingFilter",
      executionTime: 4,
    });
    (OrderRepository.create as jest.Mock).mockReturnValue(undefined);
    const result = await orderService.processOrder(baseOrderData);
    expect(result.success).toBe(false);
    expect(OrderRepository.create).toHaveBeenCalled();
    expect(result.finalOrder.status).toBe("rejected");
    expect(result.filterResults).toEqual([
      { name: "ValidationFilter", success: true },
      { name: "PricingFilter", success: false },
    ]);
    expect(result.executionTime).toBe(12);
  });

  it("should return order and filterResults from getOrderStatus", () => {
    const order = { id: "order-1", status: "completed", metadata: { filterResults: [{ name: "A", success: true }] } };
    (OrderRepository.findById as jest.Mock).mockReturnValue(order);
    const result = orderService.getOrderStatus("order-1");
    expect(result.order).toBe(order);
    expect(result.filterResults).toEqual([{ name: "A", success: true }]);
  });

  it("should throw NotFoundError if order does not exist in getOrderStatus", () => {
    (OrderRepository.findById as jest.Mock).mockReturnValue(undefined);
    expect(() => orderService.getOrderStatus("not-exist")).toThrow();
  });
});
