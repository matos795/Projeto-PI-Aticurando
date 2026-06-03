import { Router } from "express";
import matriculaController from "./matricula.controller.js";
import {
    authorizeRoles,
    requireAuth,
} from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const matriculaRoutes = Router();

matriculaRoutes.post(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ALUNO),
    matriculaController.create,
);

matriculaRoutes.get(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.findAll,
);

matriculaRoutes.get(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.findById,
);

matriculaRoutes.put(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.update,
);

matriculaRoutes.delete(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.delete,
);

matriculaRoutes.patch(
    "/:id/aprovar",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.aprovarMatricula,
);

matriculaRoutes.patch(
    "/:id/recusar",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    matriculaController.recusarMatricula,
);

export default matriculaRoutes;