import type { Request, Response } from "express";
import cursoService from "./curso.service.js";

class CursoController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, description, active, materias } = request.body ?? {};

        const curso = await cursoService.create({
            name,
            description,
            active,
            materias,
        });

        return response.status(201).json(curso);
    }

    public async findAll(request: Request, response: Response): Promise<Response> {
        const cursos = await cursoService.findAll();

        return response.status(200).json(cursos);
    }

    public async findById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const curso = await cursoService.findById(id);

        return response.status(200).json(curso);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { name, description, active, materias } = request.body;

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        const curso = await cursoService.update(id, {
            name,
            description,
            active,
            materias,
        });

        return response.status(200).json(curso);
    }

    public async addMateria(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { name, description, active } = request.body ?? {};

        if (!id || typeof id !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        try {
            const curso = await cursoService.addMateria(id, {
                name,
                description,
                active,
            });

            return response.status(201).json(curso);
        } catch (error) {
            return response.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao adicionar matéria",
            });
        }
    }

    public async removeMateria(request: Request, response: Response): Promise<Response> {
        const { id, materiaId } = request.params;

        if (!id || typeof id !== "string" || !materiaId || typeof materiaId !== "string") {
            return response.status(400).json({
                message: "ID inválido",
            });
        }

        try {
            const curso = await cursoService.removeMateria(id, materiaId);

            return response.status(200).json(curso);
        } catch (error) {
            return response.status(400).json({
                message: error instanceof Error ? error.message : "Erro ao remover matéria",
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

        await cursoService.delete(id);

        return response.status(200).json({
            message: "Curso deletado com sucesso",
        });
    }
}

export default new CursoController();