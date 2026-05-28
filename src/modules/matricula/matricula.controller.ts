import type {Request, Response } from "express";
import type { promises } from "node:dns";
import matriculaService from "./matricula.service.js";

class matriculaController {
    public async create(request:Request, response:Response): Promise<Response>{
        try {
            const {user, turma} = request.body ?? {};

            const matricula = await matriculaService.create({
                user,
                turma,
            });

            return response.status(201).json(matricula)
        } catch (error) {
            return response.status(400).json({
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao criar matrícula",
            });
        }
    }
}