import express from "express";
import cors from "cors";
import tickerRoute from "../etc/routes/tickerRoute";
import symbolsRoute from "../etc/routes/symbolsRoute";
import usdeurRoute from "../etc/routes/ExchangeRates/usdeur";

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    tickerRoute(router);
    symbolsRoute(router);
    usdeurRoute(router);

    this.express.use(cors(this.getCorsOptions()));
    this.express.options(this.getCorsOptions(), cors());
    this.express.use("/", router);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getCorsOptions(): any {
    const whiteList = process.env.WHITELIST ? process.env.WHITELIST.split(",") : "";
    return {
      origin: (
        req: express.Request,
        callback: (err: Error | null, allow?: boolean) => void
      ): void => {
        if (whiteList.indexOf(req.toString()) !== -1) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
    };
  }
}

export default new App().express;
