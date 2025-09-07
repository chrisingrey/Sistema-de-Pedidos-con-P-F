import { NotFoundError } from "../errors/errors";
import PipelineConfig from "../pipelines/pipeline-config";
import { PipelineConfigRepository } from "../repositories/pipeline-config.repository";
import { PipelineFiltersRepository } from "../repositories/pipeline-filters.repository";

export const PipelineService = {
  getPipelineConfig(): PipelineConfig {
    return PipelineConfigRepository.get();
  },

  updatePipelineConfig(newConfig: PipelineConfig): void {
    for (const filterName of newConfig.enabledFilters) {
      if (!PipelineFiltersRepository.exists(filterName))
        throw new NotFoundError(`Filter ${filterName} does not exist`);
    }
    PipelineConfigRepository.update(newConfig);
  },
};
