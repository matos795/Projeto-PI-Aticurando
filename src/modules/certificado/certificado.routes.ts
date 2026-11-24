import { Router } from "express";

import certificadoController from "./certificado.controller.js";

import {
    requireAuth,
    authorizeRoles
} from "../../middlewares/auth.middleware.js";

import { Papel_usuario } from "../user/user.types.js";

const certificadoRoutes = Router();

certificadoRoutes.get(
    "/validar/:codigo",
    certificadoController.validarAutenticidade
);

certificadoRoutes.get(
    "/meus",
    requireAuth,
    authorizeRoles(Papel_usuario.ALUNO),
    certificadoController.listarMeus
);

certificadoRoutes.get(
    "/turmas/:turmaId/elegibilidade",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    certificadoController.consultarElegibilidade
);

certificadoRoutes.get(
    "/turmas/:turmaId/emitidos",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    certificadoController.listarEmitidosDaTurma
);

certificadoRoutes.post(
    "/emitir/:matriculaId",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    certificadoController.emitir
);

certificadoRoutes.get(
    "/:id/pdf",
    requireAuth,
    authorizeRoles(
        Papel_usuario.ADM,
        Papel_usuario.ALUNO
    ),
    certificadoController.baixarPdf
);

export default certificadoRoutes;
