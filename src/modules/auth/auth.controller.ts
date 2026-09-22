import type { Request, Response } from "express";
import authService from "./auth.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";
import {
    editMeSchema,
    forgotPasswordSchema,
    loginSchema,
    registerSchema
} from "./auth.schemas.js";

class AuthController {
    public async register(request: Request, response: Response): Promise<Response> {
        const data = registerSchema.parse(request.body);

        const user = await authService.register(data);

        return response.status(201).json(user);
    }

    public async editarMe(
        request: RequestAutenticado,
        response: Response
    ): Promise<Response> {
        const data = editMeSchema.parse(request.body);

        const id = request.user?.id;

        const editedUser = await authService.editarMe(data, id);

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

    public async forgotPassword(
        request: Request,
        response: Response
    ): Promise<Response> {
        const data = forgotPasswordSchema.parse(
            request.body
        );

        await authService.forgotPassword(data);

        return response.status(200).json({
            message:
                "Se existir uma conta para este e-mail, enviaremos instruções de recuperação.",
        });
    }
}

export default new AuthController();