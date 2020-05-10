//import * as express from "express";
import {RetrieveBinanceTicker} from "./Infrastructure/Binance/RetrieveBinanceTicker";
import {Ticker} from "./Application/Ticker/Ticker";

let express = require('express');

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get("/ticker", (req, res) => {
      return new RetrieveBinanceTicker('https://api.binance.com/api/v3/ticker/')
          .retrieveTicker(req.query.symbol)
          .then((ticker: Ticker) => {
            return res.json(ticker)
          })
          .catch((error) => {
            return res.json({message: error.message});
          })
    });
    this.express.use("/", router);
  }
}

export default new App().express;
