import type { Request, Response } from "express";
import aulaTurmaService from "./aula-turma.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";
import type { NextFunction } from "express";
import { AppError } from "../../errors/app-error.js";

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


    public async minhaProximaAula(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const alunoId = request.user?.id;

            if (!alunoId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            const proximaAula =
                await aulaTurmaService.buscarProximaAulaAluno(
                    alunoId
                );

            response.status(200).json(proximaAula);

        } catch (error) {
            next(error);
        }
    }

}

export default new AulaTurmaController();