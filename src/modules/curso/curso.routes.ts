import {Router} from "express"
import cursoController from "./curso.controller.js"

const cursoRoutes = Router();

cursoRoutes.post("/", cursoController.create);
cursoRoutes.get("/", cursoController.findAll);


export default cursoRoutes;
