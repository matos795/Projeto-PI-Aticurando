import {Router} from "express"
import turmaController from "./turma.controller.js"

const turmaRoutes = Router();

turmaRoutes.post("/", turmaController.create);
turmaRoutes.get("/", turmaController.findAll);
turmaRoutes.get("/:id", turmaController.findById);

export default turmaRoutes;