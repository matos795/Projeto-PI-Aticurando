import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import cursoRoutes from "./modules/curso/curso.routes.js";
import materiaRoutes from "./modules/materia/materia.routes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/curso", cursoRoutes);
routes.use("/materia", materiaRoutes);

export default routes;