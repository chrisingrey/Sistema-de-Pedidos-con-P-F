import * as pipelineController from "../../src/controllers/pipeline.controller";
import { PipelineService } from "../../src/services/pipeline.service";
import { Request, Response } from "express";

jest.mock("../../src/services/pipeline.service");

describe("pipeline.controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    req = { body: { enabledFilters: ["A"] } };
    res = { status: statusMock };
  });

  it("should get config", () => {
    (PipelineService.getPipelineConfig as jest.Mock).mockReturnValue({ enabledFilters: ["A"] });
    pipelineController.getConfig(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ enabledFilters: ["A"] });
  });

  it("should update config", () => {
    (PipelineService.updatePipelineConfig as jest.Mock).mockReturnValue(undefined);
    pipelineController.updateConfig(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(undefined);
  });
});
