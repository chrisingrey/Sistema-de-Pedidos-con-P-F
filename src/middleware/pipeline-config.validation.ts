import { body } from "express-validator";

export const PipelineConfigValidation = [
  body("enabledFilters").notEmpty().withMessage("Enabled Filters is required"),
];
