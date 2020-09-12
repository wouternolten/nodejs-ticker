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
      .use(express.static(__dirname + '../../frontend-dist/'))
      .use("/", router);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getCorsOptions(): any {
    const allowList = process.env.ALLOWLIST ? process.env.ALLOWLIST.split(",") : "";
    return {
      origin: (
        req: express.Request,
        callback: (err: Error | null, allow?: boolean) => void
      ): void => {
        if (req === undefined || allowList.indexOf(req.toString()) !== -1) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
    };
  }
}

export default function createApp(): express.Express {
  return new App().express;
}
