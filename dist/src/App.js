"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as express from "express";
let express = require('express');
class App {
    constructor() {
        this.express = express();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        router.get("/", (req, res) => {
            res.json({
                message: "Hello World!",
            });
        });
        this.express.use("/", router);
    }
}
exports.default = new App().express;
//# sourceMappingURL=App.js.map