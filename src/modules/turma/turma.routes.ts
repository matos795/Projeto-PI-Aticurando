import { Router } from "express";
import turmaController from "./turma.controller.js";

const turmaRoutes = Router();

turmaRoutes.post("/", turmaController.create);
turmaRoutes.get("/", turmaController.findAll);
turmaRoutes.get("/:id", turmaController.findById);
turmaRoutes.put("/:id", turmaController.update);
turmaRoutes.delete("/:id", turmaController.delete);

export default turmaRoutes;