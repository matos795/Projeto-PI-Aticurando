import { Router } from "express";
import professorController from "./professor.controller.js";
import { requireAuth, authorizeRoles } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const professorRoutes = Router();

professorRoutes.get(
    "/minhas-aulas",
    requireAuth, 
    authorizeRoles(Papel_usuario.PROFESSOR),
    professorController.listarMinhasAulas
);

professorRoutes.get(
    "/chamadas/resumo",
    requireAuth,
    authorizeRoles(Papel_usuario.PROFESSOR),
    professorController.listarResumoChamadas
);

export default professorRoutes;