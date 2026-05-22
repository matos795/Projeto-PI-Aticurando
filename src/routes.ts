import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import cursoRoutes from "./modules/curso/curso.routes.js";
import materiaRoutes from "./modules/materia/materia.routes.js";
import turmaRoutes from "./modules/turma/turma.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/curso", cursoRoutes);
routes.use("/materia", materiaRoutes);
routes.use("/turma", turmaRoutes);

export default routes;