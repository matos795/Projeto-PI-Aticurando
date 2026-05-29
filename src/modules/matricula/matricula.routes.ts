import { Router } from "express";

import matriculaController from "./matricula.controller.js";
import * as authMiddleware from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const auth = authMiddleware as any;
const requireAuth = auth.requireAuth ?? auth.default;
const authorizeRoles = auth.authorizeRoles ?? auth.default?.authorizeRoles;

const matriculaRoutes = Router();

matriculaRoutes.post("/",
                    requireAuth,
                    authorizeRoles(Papel_usuario.ALUNO),
                    matriculaController.create as any);

matriculaRoutes.get("/",
                    requireAuth,
                    authorizeRoles(Papel_usuario.ALUNO),
                    matriculaController.findAll);

matriculaRoutes.get("/:id",
                    requireAuth,
                    authorizeRoles(Papel_usuario.ALUNO),
                    matriculaController.findById);

matriculaRoutes.put("/:id",
                    requireAuth,
                    authorizeRoles(Papel_usuario.ALUNO),
                    matriculaController.update);

matriculaRoutes.delete("/:id",
                    requireAuth,
                    authorizeRoles(Papel_usuario.ALUNO),
                    matriculaController.delete);

export default matriculaRoutes;