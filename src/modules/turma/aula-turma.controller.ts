import type { Request, Response } from "express";
import aulaTurmaService from "./aula-turma.service.js";

class AulaTurmaController {
    public async findAllByTurma(req: Request, res: Response) {
        try {
            const turmaId = req.params.turmaId;
            
            if (!turmaId || typeof turmaId !== 'string') {
                return res.status(400).json({ error: "O parâmetro turmaId é obrigatório." });
            }

            const agenda = await aulaTurmaService.findAllByTurma(turmaId);
            return res.status(200).json(agenda);
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
            const ocorrenciaAtualizada = await aulaTurmaService.update(id, data);
            
            if (!ocorrenciaAtualizada) {
                return res.status(404).json({ error: "Ocorrência não encontrada." });
            }
            
            return res.status(200).json(ocorrenciaAtualizada);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export default new AulaTurmaController();