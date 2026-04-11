import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import cursoRoutes from "./modules/curso/curso.routes.js";

const routes = Router();

routes.get("/teste", (request, response) => {
    return response.status(200).json({
        message: "Endpoint de teste funcionando",
    });
});

routes.use("/users", userRoutes);
routes.use("/curso", cursoRoutes);

export default routes;