import * as core from "express-serve-static-core";
import container from "../../../lib/containers/inversify.config";
import { CoinController } from "../../../src/Infrastructure/Coins/CoinController";
import { TYPES } from "../../../types/inversify/types";
import express from 'express';

export function buildRoutes(router: core.Router): void {
  const coinController = container.get<CoinController>(TYPES.CoinController);

  router.get("/coins", (_, res: express.Response) => coinController.get(res));
}
