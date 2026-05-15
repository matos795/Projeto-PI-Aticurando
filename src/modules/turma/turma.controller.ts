import type { Request, Response } from "express";
import turmaService from "./turma.service.js";

class TurmaController {
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { capacidade, turno, dataInicio, dataFim, curso, active } = request.body ?? {};

            const turma = await turmaService.create({
                capacidade,
                turno,
                dataInicio,
                dataFim,
                curso,
                active,
            });

            return response.status(201).json(turma);
        } catch (error) {
            return response.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao criar turma",
            });
        }
    }
public async findAll(request: Request, response: Response): Promise<Response> {
        const turmas = await turmaService.findAll();

        return response.status(200).json(turmas);
    }

    public async findById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const turma = await turmaService.findById(id);

        if (!turma) {
            return response.status(404).json({
                message: "Turma não encontrada",
            });
        }

        return response.status(200).json(turma);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { capacidade, turno, dataInicio, dataFim, curso, active } = request.body;

            if (!id || typeof id !== "string") {
                return response.status(400).json({
                    message: "ID inválido",
                });
            }

            const turma = await turmaService.update(id, {
                capacidade,
                turno,
                dataInicio,
                dataFim,
                curso,
                active,
            });

            if (!turma) {
                return response.status(404).json({
                    message: "Turma não encontrada",
                });
            }

            return response.status(200).json(turma);
        } catch (error) {
            return response.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao atualizar turma",
            });
        }
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const turma = await turmaService.delete(id);

        if (!turma) {
            return response.status(404).json({
                message: "Turma não encontrada",
            });
        }

        return response.status(200).json({
            message: "Turma deletada com sucesso",
        });
    }
}

export default new TurmaController();