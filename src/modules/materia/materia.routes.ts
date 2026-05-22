import {Router} from "express"
import materiaController from "./materia.controller.js"
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const materiaRoutes = Router();

materiaRoutes.post(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    materiaController.create,
);

materiaRoutes.get(
    "/",
    requireAuth,
    materiaController.findAll,
);

materiaRoutes.get(
    "/:id",
    requireAuth,
    materiaController.findById,
);

materiaRoutes.put(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    materiaController.update,
);

materiaRoutes.delete(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    materiaController.delete,
);

export default materiaRoutes;

