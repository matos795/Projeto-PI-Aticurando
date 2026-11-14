import type { Response, NextFunction } from "express";

import type { RequestAutenticado } from
    "../../types/request.types.js";

import chamadaService from "./chamada.service.js";

import type { ISalvarChamadaDTO } from
    "./chamada.types.js";

import { AppError } from "../../errors/app-error.js";

class ChamadaController {

    public async listarAlunos(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const professorId = request.user?.id;
            const aulaTurmaId = request.params.aulaTurmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof aulaTurmaId !== "string") {
                throw new AppError(
                    "Identificador da aula inválido.",
                    400
                );
            }

            const alunos =
                await chamadaService.listarAlunosDaAula(
                    aulaTurmaId,
                    professorId
                );

            response.status(200).json(alunos);

        } catch (error) {
            next(error);
        }
    }

    public async salvarChamada(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const professorId = request.user?.id;
            const aulaTurmaId = request.params.aulaTurmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof aulaTurmaId !== "string") {
                throw new AppError(
                    "Identificador da aula inválido.",
                    400
                );
            }

            const dados = request.body as ISalvarChamadaDTO;

            const chamada =
                await chamadaService.salvarChamada(
                    aulaTurmaId,
                    professorId,
                    dados
                );

            response.status(200).json(chamada);

        } catch (error) {
            next(error);
        }
    }

    public async buscarChamada(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const professorId = request.user?.id;
            const aulaTurmaId = request.params.aulaTurmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof aulaTurmaId !== "string") {
                throw new AppError(
                    "Identificador da aula inválido.",
                    400
                );
            }

            const chamada = await chamadaService.buscarChamada(
                aulaTurmaId,
                professorId
            );

            response.status(200).json(chamada);

        } catch (error) {
            next(error);
        }
    }

    public async consultarFrequencia(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const professorId = request.user?.id;
            const turmaId = request.params.turmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof turmaId !== "string") {
                throw new AppError(
                    "Identificador da turma inválido.",
                    400
                );
            }

            const frequencias =
                await chamadaService.calcularFrequenciaDaTurma(
                    turmaId,
                    professorId
                );

            response.status(200).json(frequencias);

        } catch (error) {
            next(error);
        }
    }

    public async finalizarAula(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const professorId = request.user?.id;
            const aulaTurmaId = request.params.aulaTurmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof aulaTurmaId !== "string") {
                throw new AppError(
                    "Identificador da aula inválido.",
                    400
                );
            }

            const confirmacao = request.body?.confirmacaoAntecipada;

            if (
                confirmacao !== undefined &&
                typeof confirmacao !== "boolean"
            ) {
                throw new AppError(
                    "A confirmação antecipada deve ser um booleano.",
                    400
                );
            }

            const aula = await chamadaService.finalizarAula(
                aulaTurmaId,
                professorId,
                confirmacao === true
            );

            response.status(200).json(aula);

        } catch (error) {
            next(error);
        }
    }

    public async listarHistoricoDaTurma(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const professorId = request.user?.id;
            const turmaId = request.params.turmaId;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            if (typeof turmaId !== "string") {
                throw new AppError(
                    "Identificador da turma inválido.",
                    400
                );
            }

            const historico =
                await chamadaService.listarHistoricoDaTurma(
                    turmaId,
                    professorId
                );

            response.status(200).json(historico);

        } catch (error) {
            next(error);
        }
    }
}

export default new ChamadaController();