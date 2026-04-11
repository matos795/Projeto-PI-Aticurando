import { Router } from "express"
import userController from "./user.controller.js"

const userRoutes = Router();

userRoutes.post("/", userController.create);
//http://localhost:3000/aticurando/v1/teste
userRoutes.get("/", userController.findAll);
userRoutes.get("/:id", userController.findById);
userRoutes.delete("/:id", userController.delete);

userRoutes.put("/:id", userController.update);

export default userRoutes;