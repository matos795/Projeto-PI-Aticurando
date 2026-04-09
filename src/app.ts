import type { Express } from "express";
import express from "express";
import cors from "cors";
import routes from "./routes.js";

class App {
    public server: Express;

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.server.use("/aticurando/v1", routes);
    }
}

export default new App().server;