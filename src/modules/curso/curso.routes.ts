import { Router } from "express";
import cursoController from "./curso.controller.js";
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const cursoRoutes = Router();

cursoRoutes.post("/", requireAuth, authorizeRoles(Papel_usuario.ADM), cursoController.create);
cursoRoutes.get("/", requireAuth, cursoController.findAll);
cursoRoutes.get("/:id", requireAuth, cursoController.findById);
cursoRoutes.put("/:id", requireAuth, authorizeRoles(Papel_usuario.ADM), cursoController.update);
cursoRoutes.post("/:id/materias", requireAuth, authorizeRoles(Papel_usuario.ADM), cursoController.addMateria);
cursoRoutes.delete("/:id/materias/:materiaId", requireAuth, authorizeRoles(Papel_usuario.ADM), cursoController.removeMateria);
cursoRoutes.delete("/:id", requireAuth, authorizeRoles(Papel_usuario.ADM), cursoController.delete);

export default cursoRoutes;