import { OrderProcessingPipeline } from "../../src/pipelines/order-processing-pipeline";
import Order from "../../src/models/order.model";
import PipelineConfig from "../../src/pipelines/pipeline-config";
import FilterResult from "../../src/filters/filter-result";
import OrderFilter from "../../src/filters/order.filter";

describe("OrderProcessingPipeline", () => {
  let baseOrder: Order;
  let config: PipelineConfig;
  let filter1: OrderFilter;
  let filter2: OrderFilter;
  let pipeline: OrderProcessingPipeline;

  // Utilidad para crear filtros mockeados
  const makeMockFilter = (name: string, result: Partial<FilterResult>): OrderFilter => ({
    name,
    process: jest.fn().mockImplementation(async (order, context) => ({
      success: result.success ?? true,
      order: result.order ?? order,
      errors: result.errors ?? [],
      warnings: result.warnings ?? [],
    })),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    baseOrder = {
      id: "order-1",
      customerId: "cust-001",
      items: [
        { productId: "prod-101", quantity: 2 },
        { productId: "prod-102", quantity: 1 },
      ],
      status: "pending",
      createdAt: new Date(),
    };
    config = {
      enabledFilters: ["MockFilter1", "MockFilter2"],
    };
    filter1 = makeMockFilter("MockFilter1", { success: true });
    filter2 = makeMockFilter("MockFilter2", { success: true });
    pipeline = new OrderProcessingPipeline([filter1, filter2]);
  });

  describe("process", () => {
    it("debería procesar todos los filtros exitosamente y devolver la orden completada", async () => {
      const result = await pipeline.process({ ...baseOrder }, config);
      expect(result.success).toBe(true);
      expect(result.finalOrder.status).toBe("completed");
      expect(result.filterResults).toHaveLength(2);
      expect(result.failedAt).toBeUndefined();
    });

    it("debería devolver la orden rechazada si un filtro falla", async () => {
      filter2.process = jest.fn().mockResolvedValue({
        success: false,
        order: baseOrder,
        errors: ["fail"],
        warnings: [],
      });
      const result = await pipeline.process({ ...baseOrder }, config);
      expect(result.success).toBe(false);
      expect(result.finalOrder.status).toBe("rejected");
      expect(result.filterResults).toHaveLength(2);
      expect(result.failedAt).toBe("MockFilter2");
    });

    it("debería saltar filtros no habilitados en la config", async () => {
      const result = await pipeline.process({ ...baseOrder }, { enabledFilters: ["MockFilter1"] });
      expect(result.success).toBe(true);
      expect(result.filterResults).toHaveLength(1);
      expect((result.filterResults[0] as any).name).toBe("MockFilter1");
    });

    it("debería devolver la orden rechazada si un filtro lanza una excepción", async () => {
      filter2.process = jest.fn().mockImplementation(() => { throw new Error("Unexpected error"); });
      const result = await pipeline.process({ ...baseOrder }, config);
      expect(result.success).toBe(false);
      expect(result.finalOrder.status).toBe("rejected");
      expect(result.failedAt).toBe("Unexpected error");
    });
  });

  describe("addFilter", () => {
    it("solo debe agregar filtros únicos", () => {
      pipeline.addFilter(filter1);
      expect(pipeline.filters).toHaveLength(2);
      const filter3 = makeMockFilter("MockFilter3", { success: true });
      pipeline.addFilter(filter3);
      expect(pipeline.filters).toHaveLength(3);
    });
  });

  describe("removeFilter", () => {
    it("debe eliminar el filtro por nombre", () => {
      pipeline.removeFilter("MockFilter1");
      expect(pipeline.filters).toHaveLength(1);
      expect(pipeline.filters[0].name).toBe("MockFilter2");
    });
  });
});
