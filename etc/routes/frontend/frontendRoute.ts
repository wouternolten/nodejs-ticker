import * as core from "express-serve-static-core";
import * as path from "path";

function getFile(fileName: string): string
{
  return path.join(`${__dirname}/${fileName}`);
}

export function buildRoutes(router: core.Router): void {
  router.get('/', (req: any, res: any) => {
    res.sendFile(getFile('../../../frontend-dist/index.html'));
  });
}
