import type {
    Request,
    Response,
    NextFunction
} from "express";
import { isValidObjectId } from "mongoose";
import aulaTurmaService from "./aula-turma.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";
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
        } catch (error: unknown) {
            return res.status(400).json({
                error: error instanceof Error
                    ? error.message
                    : "Ocorreu um erro inesperado."
            });
        }
    }


    public async update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.params.id;

            if (
                typeof id !== "string" ||
                !isValidObjectId(id)
            ) {
                throw new AppError(
                    "Identificador da aula inválido.",
                    400
                );
            }

            const ocorrenciaAtualizada =
                await aulaTurmaService.update(
                    id,
                    req.body ?? {}
                );

            if (!ocorrenciaAtualizada) {
                throw new AppError(
                    "Ocorrência de aula não encontrada.",
                    404
                );
            }

            res.status(200).json(ocorrenciaAtualizada);

        } catch (error) {
            next(error);
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