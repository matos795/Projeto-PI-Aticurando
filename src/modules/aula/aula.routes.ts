import { Router } from "express";
import aulaController from "./aula.controller.js";

const aulaRoutes = Router();

aulaRoutes.post("/", aulaController.create);
aulaRoutes.get("/", aulaController.findAll);
aulaRoutes.get("/materia/:materiaId", aulaController.findAllByMateria);
aulaRoutes.get("/:id", aulaController.findById);
aulaRoutes.put("/:id", aulaController.update);
aulaRoutes.delete("/:id", aulaController.delete);

export default aulaRoutes;