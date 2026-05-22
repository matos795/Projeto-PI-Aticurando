import { Router } from "express"
import userController from "./user.controller.js"
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "./user.types.js";

const userRoutes = Router();

userRoutes.get(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.findAll,
);

userRoutes.get(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.findById,
);

userRoutes.put(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.update,
);

userRoutes.delete(
    "/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.delete,
);


export default userRoutes;