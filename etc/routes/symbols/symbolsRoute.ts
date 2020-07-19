import { BinanceSymbolsService } from "../../../src/Domain/Binance/Symbols/BinanceSymbolsService";
import * as core from "express-serve-static-core";

export function buildRoutes(router: core.Router): void {
  router.get("/symbols", (req: any, res: any) => {
    return new BinanceSymbolsService()
      .retrieveAll()
      .then((symbols: string[]) => {
        return res.json(symbols);
      })
      .catch((error) => {
        return res.json({ message: error.message });
      });
  });
}
