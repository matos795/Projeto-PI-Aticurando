import { Router } from "express";
import authController from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", requireAuth, authController.getMe);
authRoutes.put("/edit-me", requireAuth, authController.editarMe);
authRoutes.post("/forgot-password", authController.forgotPassword.bind(authController));
authRoutes.post("/reset-password", authController.resetPassword);

export default authRoutes;