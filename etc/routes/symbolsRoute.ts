import { BinanceSymbols } from "../../src/Infrastructure/Binance/Symbols/BinanceSymbols";
import * as core from "express-serve-static-core";

export default function symbolsRoute(router: core.Router): void {
  router.get("/symbols", (req: any, res: any) => {
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
