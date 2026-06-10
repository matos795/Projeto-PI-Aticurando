import type { Request, Response } from "express";
import authService from "./auth.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";

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
        const { email, senha } = request.body ?? {};
        console.log("Login attempt:", { email, senha });
        const result = await authService.login({
            email,
            senha,
        });

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

     public async registerCurso(request: Request, response: Response): Promise<Response> {
        const { name, description, materias } = request.body ?? {};

        const curso = await authService.registerCurso({
            name,
            description,
            materias
        });

        return response.status(201).json(curso);
    }

     /* public async registerTurma(request: Request, response: Response): Promise<Response> {
        const { turno, curso, dataInicio, dataFim, capacidade } = request.body ?? {};

        const turma = await authService.registerTurma({
            turno,
            curso,
            dataInicio,
            dataFim,
            capacidade
        });

        return response.status(201).json(turma);
    } */
}

export default new AuthController();