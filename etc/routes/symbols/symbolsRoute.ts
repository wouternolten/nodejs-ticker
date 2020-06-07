import { BinanceSymbols } from "../../../src/Infrastructure/Binance/Symbols/BinanceSymbols";
import * as core from "express-serve-static-core";
import path from "path";

export function buildRoutes(router: core.Router): void {
  router.get("/symbols", (req: any, res: any) => {
    console.log(path.relative(process.cwd(), __dirname), __filename, __dirname);
    return new BinanceSymbols()
      .retrieveAll()
      .then((symbols: string[]) => {
        return res.json(symbols);
      })
      .catch((error) => {
        return res.json({ message: error.message });
      });
  });
}
