import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/pipeline.controller";
import { PipelineConfigValidation } from "../middleware/pipeline-config.validation";
import { ValidateRequest } from "../middleware/validate-request";

const router = Router();

router.get("/config", getConfig);
router.put("/config", PipelineConfigValidation, ValidateRequest, updateConfig);

export default router;
