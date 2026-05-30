import { Router } from "express";
import authController from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/register-curso", authController.registerCurso);
authRoutes.post("/register-turma", authController.registerTurma);
authRoutes.get("/me", requireAuth, authController.getMe);

export default authRoutes;