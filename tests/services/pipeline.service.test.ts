import { PipelineService } from "../../src/services/pipeline.service";
import { PipelineConfigRepository } from "../../src/repositories/pipeline-config.repository";
import { PipelineFiltersRepository } from "../../src/repositories/pipeline-filters.repository";
import { NotFoundError } from "../../src/errors/errors";

jest.mock("../../src/repositories/pipeline-config.repository");
jest.mock("../../src/repositories/pipeline-filters.repository");

describe("PipelineService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get pipeline config", () => {
    (PipelineConfigRepository.get as jest.Mock).mockReturnValue({ enabledFilters: ["A"] });
    const config = PipelineService.getPipelineConfig();
    expect(config).toEqual({ enabledFilters: ["A"] });
  });

  it("should update pipeline config if all filters exist", () => {
    (PipelineFiltersRepository.exists as jest.Mock).mockReturnValue(true);
    PipelineService.updatePipelineConfig({ enabledFilters: ["A", "B"] });
    expect(PipelineFiltersRepository.exists).toHaveBeenCalledWith("A");
    expect(PipelineFiltersRepository.exists).toHaveBeenCalledWith("B");
    expect(PipelineConfigRepository.update).toHaveBeenCalledWith({ enabledFilters: ["A", "B"] });
  });

  it("should throw NotFoundError if a filter does not exist", () => {
    (PipelineFiltersRepository.exists as jest.Mock).mockImplementation((name) => name === "A");
    expect(() => PipelineService.updatePipelineConfig({ enabledFilters: ["A", "X"] })).toThrow(NotFoundError);
  });
});
