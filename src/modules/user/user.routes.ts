import { Router } from "express"
import userController from "./user.controller.js"
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "./user.types.js";

const userRoutes = Router();

userRoutes.post(
    "/professor",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.createProfessor
);

userRoutes.put(
    "/professor/:id",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.updateProfessor
);

userRoutes.get(
    "/professor",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.findAllProfessores
);

userRoutes.patch(
    "/professor/:id/inativar",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    userController.inactivateProfessor
);

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