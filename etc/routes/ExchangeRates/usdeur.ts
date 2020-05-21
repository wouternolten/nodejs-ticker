import { UsdEurExchangeRate } from "../../../src/Infrastructure/Fiat/ExchangeRates/UsdEurExchangeRate";
import * as core from "express-serve-static-core";

export default function usdeurRoute(router: core.Router): void {
  router.get("/exchange/usdeur", (req: any, res: any) => {
    return new UsdEurExchangeRate()
      .retrieveExchangeRate()
      .then((rate: number) => {
        return res.json(rate);
      })
      .catch((error) => {
        return res.json({ message: error.message });
      });
  });
}
