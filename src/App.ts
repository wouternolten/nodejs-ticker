import express from "express";
import tickerRoute from "../etc/routes/tickerRoute";
import symbolsRoute from "../etc/routes/symbolsRoute";

class App {
  public express: any;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    tickerRoute(router);
    symbolsRoute(router);

    this.express.use("/", router);
  }
}

export default new App().express;
