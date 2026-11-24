import { Router } from "express";

import certificadoController from "./certificado.controller.js";

import {
    requireAuth,
    authorizeRoles
} from "../../middlewares/auth.middleware.js";

import { Papel_usuario } from "../user/user.types.js";

const certificadoRoutes = Router();

certificadoRoutes.get(
    "/turmas/:turmaId/elegibilidade",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    certificadoController.consultarElegibilidade
);

export default certificadoRoutes;