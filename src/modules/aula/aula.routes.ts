import { Router } from "express";
import aulaController from "./aula.controller.js";
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const aulaRoutes = Router();

aulaRoutes.post("/", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.create);
aulaRoutes.get("/", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.findAll);
aulaRoutes.get("/materia/:materiaId", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.findAllByMateria);
aulaRoutes.get("/:id", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.findById);
aulaRoutes.put("/:id", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.update);
aulaRoutes.delete("/:id", requireAuth, authorizeRoles (Papel_usuario.ADM), aulaController.delete);

export default aulaRoutes;