import * as core from "express-serve-static-core";

export function buildRoutes(router: core.Router): void {
  router.get("/coins", (req, res) => res.json({ message: "Not implemented yet." }));
}
