import { Router } from "express";

import chamadaController from "./chamada.controller.js";

import {
    requireAuth,
    authorizeRoles
} from "../../middlewares/auth.middleware.js";

import { Papel_usuario } from
    "../user/user.types.js";

const chamadaRoutes = Router();

chamadaRoutes.use(
    requireAuth,
    authorizeRoles(Papel_usuario.PROFESSOR)
);

chamadaRoutes.get(
    "/aulas/:aulaTurmaId/alunos",
    chamadaController.listarAlunos
);

chamadaRoutes.put(
    "/aulas/:aulaTurmaId/chamada",
    chamadaController.salvarChamada
);

chamadaRoutes.get(
    "/aulas/:aulaTurmaId/chamada",
    chamadaController.buscarChamada
);

chamadaRoutes.get(
    "/turmas/:turmaId/frequencia",
    chamadaController.consultarFrequencia
);

chamadaRoutes.patch(
    "/aulas/:aulaTurmaId/finalizar",
    chamadaController.finalizarAula
);

chamadaRoutes.get(
    "/turmas/:turmaId/chamadas",
    chamadaController.listarHistoricoDaTurma
);

export default chamadaRoutes;