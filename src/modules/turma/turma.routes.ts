import { Router } from "express";
import turmaController from "./turma.controller.js";
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";
import aulaTurmaController from "./aula-turma.controller.js";

const turmaRoutes = Router();

turmaRoutes.get("/:turmaId/agenda", requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    aulaTurmaController.findAllByTurma);
    
turmaRoutes.put("/agenda/:id", requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    aulaTurmaController.update);

turmaRoutes.post(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    turmaController.create
);
turmaRoutes.get(
    "/",
    requireAuth,
    turmaController.findAll
);
turmaRoutes.get(
    "/:id",
    requireAuth,
    turmaController.findById
);
turmaRoutes.put(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    turmaController.update
);
turmaRoutes.delete(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    turmaController.delete
);



export default turmaRoutes;