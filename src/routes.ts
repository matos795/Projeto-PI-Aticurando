import { Router } from "express";
import userRoutes from "./modules/user/user.routes.js";

const routes = Router();

routes.get("/teste", (request, response) => {
    return response.status(200).json({
        message: "Endpoint de teste funcionando",
    });
});

routes.use("/users", userRoutes);

export default routes;