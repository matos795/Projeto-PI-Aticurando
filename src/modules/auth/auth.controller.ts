import type { Request, Response } from "express";
import authService from "./auth.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

class AuthController {
    public async register(request: Request, response: Response): Promise<Response> {
        const data = registerSchema.parse(request.body);

        const user = await authService.register(data);

        return response.status(201).json(user);
    }

    public async editarMe(request: RequestAutenticado, response: Response): Promise<Response> {
        const {name, email} = request.body ?? {};

        const id = request.user?.id;

        const editedUser = await authService.editarMe({
            name,
            email,
        }, id);

        return response.status(200).json(editedUser);
    }

    public async login(request: Request, response: Response): Promise<Response> {
        
        const data = loginSchema.parse(request.body);

        const result = await authService.login(data);

        return response.status(200).json(result);
    }

    public async getMe(
        request: RequestAutenticado,
        response: Response,
    ): Promise<Response> {
        const userId = request.user?.id;

        if (!userId) {
            return response.status(401).json({
                message: "Usuário não autenticado",
            });
        }

        const user = await authService.getMe(userId);

        return response.status(200).json(user);
    }
}

export default new AuthController();