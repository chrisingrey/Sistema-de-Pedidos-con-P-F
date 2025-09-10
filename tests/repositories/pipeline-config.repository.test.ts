import { PipelineConfigRepository } from "../../src/repositories/pipeline-config.repository";

describe("PipelineConfigRepository", () => {
  beforeEach(() => {
    PipelineConfigRepository.update({ enabledFilters: ["A"] });
  });

  it("should get config", () => {
    const config = PipelineConfigRepository.get();
    expect(config.enabledFilters).toContain("A");
  });

  it("should update config", () => {
    PipelineConfigRepository.update({ enabledFilters: ["B", "C"] });
    const config = PipelineConfigRepository.get();
    expect(config.enabledFilters).toEqual(["B", "C"]);
  });

  it("should not fail if update called with no enabledFilters", () => {
    // @ts-ignore
    PipelineConfigRepository.update({});
    const config = PipelineConfigRepository.get();
    expect(config.enabledFilters).toBeDefined();
  });
});
