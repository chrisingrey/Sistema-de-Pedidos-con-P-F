import { Request, Response } from "express";
import { PipelineService } from "../services/pipeline.service";

export const getConfig = (req: Request, res: Response) => {
  const result = PipelineService.getPipelineConfig();
  res.status(200).json(result);
};
export const updateConfig = (req: Request, res: Response) => {
  const { enabledFilters } = req.body;
  const result = PipelineService.updatePipelineConfig({
    enabledFilters: enabledFilters,
  });
  res.status(200).json(result);
};
