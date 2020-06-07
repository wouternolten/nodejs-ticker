import express from "express";
import cors from "cors";
import { BaseRouter } from "../etc/routes/BaseRouter";
import bodyParser from 'body-parser';

class App {
  public express: express.Express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();

    BaseRouter.mountRoutes(router);

    this.express
      .use(bodyParser.urlencoded({ extended: true }))
      .use(express.json())
      .use(cors(this.getCorsOptions()))
      .use("/", router);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getCorsOptions(): any {
    const whiteList = process.env.WHITELIST ? process.env.WHITELIST.split(",") : "";
    return {
      origin: (
        req: express.Request,
        callback: (err: Error | null, allow?: boolean) => void
      ): void => {
        if (req === undefined || whiteList.indexOf(req.toString()) !== -1) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
    };
  }
}

export default new App().express;
