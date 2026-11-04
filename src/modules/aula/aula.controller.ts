import type { Request, Response } from "express";
import aulaService from "./aula.service.js";

class AulaController {
    public async create(req: Request, res: Response){
        try{
            const {titulo, descricao, duracao, materiaId, ordem} = req.body ?? {};
            const aula = await aulaService.create({
                titulo,
                descricao,
                duracao,
                materiaId,
                ordem
            });
            return res.status(201).json(aula);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
    public async findAll(req: Request, res: Response) {
        try {
            const aulas = await aulaService.findAll();
            return res.status(200).json(aulas);
        } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno no servidor" });
         }
    }

    public async findAllByMateria(req: Request, res: Response) {
        try {
            const materiaId = req.params.materiaId;
            
            if (!materiaId || typeof materiaId !== 'string') {
                return res.status(400).json({ error: "O parâmetro materiaId é obrigatório e deve ser um texto válido." });
            }

            const aulas = await aulaService.findAllByMateria(materiaId);
            return res.status(200).json(aulas);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    public async findById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "O parâmetro id é obrigatório." });
            }

            const aula = await aulaService.findById(id);
            if (!aula) {
                return res.status(404).json({ error: "Aula não encontrada" });
            }
            return res.status(200).json(aula);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "O parâmetro id é obrigatório." });
            }

            const data = req.body;
            const aulaAtualizada = await aulaService.update(id, data);
            if (!aulaAtualizada) {
                return res.status(404).json({ error: "Aula não encontrada" });
            }
            return res.status(200).json(aulaAtualizada);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "O parâmetro id é obrigatório." });
            }

            const aulaInativada = await aulaService.delete(id);
            return res.status(200).json(aulaInativada);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new AulaController();