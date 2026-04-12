import { Router } from "express";
import cursoController from "./curso.controller.js";

const cursoRoutes = Router();

cursoRoutes.post("/", cursoController.create);
cursoRoutes.get("/", cursoController.findAll);
cursoRoutes.get("/:id", cursoController.findById);
cursoRoutes.put("/:id", cursoController.update);
cursoRoutes.delete("/:id", cursoController.delete);

export default cursoRoutes;