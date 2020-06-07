import * as core from "express-serve-static-core";
import glob from "glob";

export class BaseRouter {
  static mountRoutes(router: core.Router): void {
    glob.sync("**/*.ts", { cwd: `${__dirname}/` }).forEach((fileName: string) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routeClass = require(`./${fileName}`);

      if (!routeClass.buildRoutes) {
        return;
      }

      routeClass.buildRoutes(router);
    });
  }
}
