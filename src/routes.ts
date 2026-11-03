import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import cursoRoutes from "./modules/curso/curso.routes.js";
import materiaRoutes from "./modules/materia/materia.routes.js";
import turmaRoutes from "./modules/turma/turma.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import matriculaRoutes from "./modules/matricula/matricula.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import mongoose from "mongoose";

const routes = Router();

routes.get("/health", async (_request, response) => {
    try {
        const db = mongoose.connection.db;

        if (!db) {
            return response.status(503).json({
                status: "degraded",
                database: "disconnected"
            });
        }

        const timeout = new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Database healthcheck timeout")),
                1500
            )
        );

        await Promise.race([
            db.admin().ping(),
            timeout
        ]);

        return response.status(200).json({
            status: "ok",
            database: "connected"
        });
    } catch {
        return response.status(503).json({
            status: "degraded",
            database: "disconnected"
        });
    }
});

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/curso", cursoRoutes);
routes.use("/materia", materiaRoutes);
routes.use("/turma", turmaRoutes);
routes.use("/matricula", matriculaRoutes);
routes.use("/dashboard", dashboardRoutes);
export default routes;