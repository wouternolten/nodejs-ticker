import { RetrieveBinanceTicker } from "../../src/Infrastructure/Binance/Ticker/RetrieveBinanceTicker";
import { Ticker } from "../../src/Application/Ticker/Ticker";
import * as core from "express-serve-static-core";

export default function tickerRoute(router: core.Router) {
  router.get("/ticker", (req: any, res: any) => {
    return new RetrieveBinanceTicker(`${process.env.BINANCE_BASE_URL}/api/v3/ticker/`)
      .retrieveTicker(req.query.symbol)
      .then((ticker: Ticker) => {
        return res.json(ticker);
      })
      .catch((error) => {
        return res.json({ message: error.message });
      });
  });
}
