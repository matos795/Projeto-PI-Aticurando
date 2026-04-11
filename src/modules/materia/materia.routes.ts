import {Router} from "express"
import materiaController from "./materia.controller.js"

const materiaRoutes = Router();

materiaRoutes.post("/", materiaController.create);
materiaRoutes.get("/", materiaController.findAll);
materiaRoutes.get("/:id", materiaController.findById);
materiaRoutes.delete("/:id", materiaController.delete);
materiaRoutes.put("/:id", materiaController.update);

export default materiaRoutes;

