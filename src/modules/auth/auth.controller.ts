import type { Request, Response } from "express";
import authService from "./auth.service.js";

class AuthController {
    public async register(request: Request, response: Response): Promise<Response> {
        const { name, cpf, email, senha } = request.body ?? {};

        const user = await authService.register({
            name,
            cpf,
            email,
            senha,
        });

        return response.status(201).json(user);
    }

    public async login(request: Request, response: Response): Promise<Response> {
        const { email, senha } = request.body ?? {};
        console.log("Login attempt:", { email, senha });
        const result = await authService.login({
            email,
            senha,
        });

        return response.status(200).json(result);
    }
}

export default new AuthController();