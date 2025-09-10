import { PipelineFiltersRepository } from "../../src/repositories/pipeline-filters.repository";

describe("PipelineFiltersRepository", () => {
  it("should get all filters", () => {
    const filters = PipelineFiltersRepository.get();
    expect(Array.isArray(filters)).toBe(true);
    expect(filters.length).toBeGreaterThan(0);
  });

  it("should return true if filter exists", () => {
    const filters = PipelineFiltersRepository.get();
    const name = filters[0].name;
    expect(PipelineFiltersRepository.exists(name)).toBe(true);
  });

  it("should return false if filter does not exist", () => {
    expect(PipelineFiltersRepository.exists("not-exist")).toBe(false);
  });
});
