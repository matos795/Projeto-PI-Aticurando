import type {Request, Response } from "express";
import type { promises } from "node:dns";
import matriculaService from "./matricula.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";
import authService from "../auth/auth.service.js";

class MatriculaController {
    public async create(request: RequestAutenticado,response: Response)  : Promise<Response> {
    try {
        const userId = request.user.id;

        const { turma } = request.body;

        const matricula =
            await matriculaService.create({
                user: userId,
                turma,
            });

        return response.status(201).json(
            matricula
        );
        } catch (error) {
        return response.status(400).json({
            message:
                error instanceof Error
                    ? error.message
                    : "Erro ao criar matrícula",
        });
        }
    }

    public async findAll(request: Request, response: Response): Promise<Response>{
        const matriculas = await matriculaService.findAll();

        return response.status(200).json(matriculas);
    }

     public async findById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const matricula = await matriculaService.findById(id);

        if (!matricula) {
            return response.status(404).json({
                message: "Matrícula não encontrada",
            });
        }

        return response.status(200).json(matricula);
    }

    public async update(request: Request,response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const {
                frequencia,
                status,
                motivoCancelamento,
            } = request.body;

            if (!id || typeof id !== "string") {
                return response.status(400).json({
                    message: "ID inválido",
                });
            }

            const matricula = await matriculaService.update(
                id,
                {
                    frequencia,
                    status,
                    motivoCancelamento,
                }
            );

            if (!matricula) {
                return response.status(404).json({
                    message: "Matrícula não encontrada",
                });
            }

            return response.status(200).json(matricula);
        } catch (error) {
            return response.status(400).json({
                message:
                    error instanceof Error
                        ? error.message
                        : "Erro ao atualizar matrícula",
            });
        }
    }

    public async delete( request: Request,response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const matricula = await matriculaService.delete(id);

        if (!matricula) {
            return response.status(404).json({
                message: "Matrícula não encontrada",
            });
        }

        return response.status(200).json({
            message: "Matrícula deletada com sucesso",
        });
    }
}

export default new MatriculaController();