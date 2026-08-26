import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";
import cursoRoutes from "./modules/curso/curso.routes.js";
import materiaRoutes from "./modules/materia/materia.routes.js";
import turmaRoutes from "./modules/turma/turma.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import matriculaRoutes from "./modules/matricula/matricula.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/curso", cursoRoutes);
routes.use("/materia", materiaRoutes);
routes.use("/turma", turmaRoutes);
routes.use("/matricula", matriculaRoutes);
routes.use("/dashboard", dashboardRoutes);
export default routes;