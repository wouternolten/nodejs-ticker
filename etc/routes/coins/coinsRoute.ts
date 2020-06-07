import * as core from "express-serve-static-core";
import container from "../../../lib/containers/inversify.config";
import { CoinController } from "../../../src/Infrastructure/Coins/CoinController";
import { TYPES } from "../../../types/inversify/types";

export function buildRoutes(router: core.Router): void {
  const coinController = container.get<CoinController>(TYPES.CoinController);

  router.get("/coins", (req, res) => res.json({ message: coinController.get() }));
}
