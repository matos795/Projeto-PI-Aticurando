import {Router} from "express"
import dashboardController from "./dashboard.controller.js"
import { authorizeRoles, requireAuth } from "../../middlewares/auth.middleware.js";
import { Papel_usuario } from "../user/user.types.js";

const dashboardRoutes = Router();



dashboardRoutes.get(
    "/",
    requireAuth,
    authorizeRoles(Papel_usuario.ADM),
    dashboardController.findAll,
);



export default dashboardRoutes;



