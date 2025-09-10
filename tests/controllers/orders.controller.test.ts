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
      executionTime: 10,
      failedAt: undefined,
      filterResults: [],
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: true,
        finalOrder: { id: "1", status: "completed" },
        executionTime: 10,
        failedAt: undefined,
      }),
    });
  });

  it("should fail on cliente inexistente (CustomerValidationFilter)", async () => {
    req.body = { customerId: "cliente-invalido", items: [{ productId: "prod-101", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "2", status: "rejected" },
      filterResults: [
        { name: "CustomerValidationFilter", success: false, errors: ["Cliente no encontrado"], warnings: [] }
      ],
      failedAt: "CustomerValidationFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "2", status: "rejected" },
        failedAt: "CustomerValidationFilter",
        filterResults: [
          expect.objectContaining({
            name: "CustomerValidationFilter",
            success: false,
            errors: expect.arrayContaining(["Cliente no encontrado"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on falta campo items (DataIntegrityFilter)", async () => {
    req.body = { customerId: "cust-001" };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "3", status: "rejected" },
      filterResults: [
        { name: "DataIntegrityFilter", success: false, errors: ["Faltan items"], warnings: [] }
      ],
      failedAt: "DataIntegrityFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "3", status: "rejected" },
        failedAt: "DataIntegrityFilter",
        filterResults: [
          expect.objectContaining({
            name: "DataIntegrityFilter",
            success: false,
            errors: expect.arrayContaining(["Faltan items"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on cantidad inválida (DataIntegrityFilter)", async () => {
    req.body = { customerId: "cust-001", items: [{ productId: "prod-101", quantity: 0 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "4", status: "rejected" },
      filterResults: [
        { name: "DataIntegrityFilter", success: false, errors: ["Cantidad inválida"], warnings: [] }
      ],
      failedAt: "DataIntegrityFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "4", status: "rejected" },
        failedAt: "DataIntegrityFilter",
        filterResults: [
          expect.objectContaining({
            name: "DataIntegrityFilter",
            success: false,
            errors: expect.arrayContaining(["Cantidad inválida"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on producto inexistente (ProductValidationFilter)", async () => {
    req.body = { customerId: "cust-001", items: [{ productId: "prod-invalido", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "5", status: "rejected" },
      filterResults: [
        { name: "ProductValidationFilter", success: false, errors: ["Producto no encontrado"], warnings: [] }
      ],
      failedAt: "ProductValidationFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "5", status: "rejected" },
        failedAt: "ProductValidationFilter",
        filterResults: [
          expect.objectContaining({
            name: "ProductValidationFilter",
            success: false,
            errors: expect.arrayContaining(["Producto no encontrado"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on stock insuficiente (ProductValidationFilter)", async () => {
    req.body = { customerId: "cust-001", items: [{ productId: "prod-sinstock", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "6", status: "rejected" },
      filterResults: [
        { name: "ProductValidationFilter", success: false, errors: ["Stock insuficiente"], warnings: [] }
      ],
      failedAt: "ProductValidationFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "6", status: "rejected" },
        failedAt: "ProductValidationFilter",
        filterResults: [
          expect.objectContaining({
            name: "ProductValidationFilter",
            success: false,
            errors: expect.arrayContaining(["Stock insuficiente"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on producto sin precio (PriceCalculationFilter)", async () => {
    req.body = { customerId: "cust-001", items: [{ productId: "prod-sinprecio", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "7", status: "rejected" },
      filterResults: [
        { name: "PriceCalculationFilter", success: false, errors: ["Producto sin precio"], warnings: [] }
      ],
      failedAt: "PriceCalculationFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "7", status: "rejected" },
        failedAt: "PriceCalculationFilter",
        filterResults: [
          expect.objectContaining({
            name: "PriceCalculationFilter",
            success: false,
            errors: expect.arrayContaining(["Producto sin precio"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on cliente sin membresía válida (MembershipDiscountFilter)", async () => {
    req.body = { customerId: "cust-nomem", items: [{ productId: "prod-101", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "8", status: "rejected" },
      filterResults: [
        { name: "MembershipDiscountFilter", success: false, errors: ["Cliente sin membresía válida"], warnings: [] }
      ],
      failedAt: "MembershipDiscountFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "8", status: "rejected" },
        failedAt: "MembershipDiscountFilter",
        filterResults: [
          expect.objectContaining({
            name: "MembershipDiscountFilter",
            success: false,
            errors: expect.arrayContaining(["Cliente sin membresía válida"]),
            warning: [],
          })
        ]
      })
    });
  });

  it("should fail on dirección de cliente incompleta (TaxCalculationFilter)", async () => {
    req.body = { customerId: "cust-tax-invalido", items: [{ productId: "prod-101", quantity: 1 }] };
    orderService.processOrder.mockResolvedValue({
      success: false,
      finalOrder: { id: "9", status: "rejected" },
      filterResults: [
        { name: "TaxCalculationFilter", success: false, errors: ["Dirección de cliente incompleta"], warnings: [] }
      ],
      failedAt: "TaxCalculationFilter",
      executionTime: 5,
    });
    await process(orderService)(req as Request, res as Response);
    expect(orderService.processOrder).toHaveBeenCalledWith(req.body);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      result: expect.objectContaining({
        sucess: false,
        finalOrder: { id: "9", status: "rejected" },
        failedAt: "TaxCalculationFilter",
        filterResults: [
          expect.objectContaining({
            name: "TaxCalculationFilter",
            success: false,
            errors: expect.arrayContaining(["Dirección de cliente incompleta"]),
            warning: [],
          })
        ]
      })
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
