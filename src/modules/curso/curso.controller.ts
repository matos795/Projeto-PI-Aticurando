import type { Request, Response } from "express";
import cursoService from "./curso.service.js";
import Curso from "./curso.model.js";

class CursoController{
    public async create (request: Request, response: Response): Promise<Response>{
        const {name, description, active} = request.body ?? {};

        const curso = await cursoService.create({
            name,
            description,
            active
        });

        return response.status(201).json(curso);
    };
}

export default new CursoController();