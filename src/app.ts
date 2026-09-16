import type { Express } from "express";
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

class App {
    public server: Express;

    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
        this.server.use(errorMiddleware);
    }

    private middlewares(): void {
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.server.use("/aticurando/v1", routes);
        this.server.use(errorMiddleware);
    }
}

export default new App().server;