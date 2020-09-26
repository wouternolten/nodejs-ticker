import * as core from "express-serve-static-core";
import container from "../../../lib/containers/inversify.config";
import {TYPES} from "../../../types/inversify/types";
import {SymbolController} from "../../../src/Infrastructure/Symbols/SymbolController";
import express from "express";

export function buildRoutes(router: core.Router): void {
  const symbolController = container.get<SymbolController>(TYPES.SymbolController);

  router.get("/symbols", (request: express.Request, res: express.Response) => symbolController.get(request, res));
}
