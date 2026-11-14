import type { Response, NextFunction } from "express";
import type { RequestAutenticado } from "../../types/request.types.js";
import professorService from "./professor.service.js";
import { AppError } from "../../errors/app-error.js";

class ProfessorController {
    public async listarMinhasAulas(request: RequestAutenticado, response: Response): Promise<Response> {
        try {
            const professorId = request.user?.id;

            if (!professorId) {
                return response.status(401).json({ message: "Usuário não autenticado" });
            }

            const { status, turmaId } = request.query;
            const statusFiltro = typeof status === "string" ? status : "";
            const turmaIdFiltro = typeof turmaId === "string" ? turmaId : "";

            const minhasAulas = await professorService.listarMinhasAulas(professorId, {
                status: statusFiltro,
                turmaId: turmaIdFiltro
            });

            return response.status(200).json(minhasAulas);

        } catch (error: any) {
            return response.status(400).json({ error: error.message || "Erro ao buscar a agenda do professor." });
        }
    }

    public async listarResumoChamadas(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const professorId = request.user?.id;

            if (!professorId) {
                throw new AppError(
                    "Usuário não autenticado.",
                    401
                );
            }

            const resumo =
                await professorService.listarResumoChamadas(
                    professorId
                );

            response.status(200).json(resumo);

        } catch (error) {
            next(error);
        }
    }
}

export default new ProfessorController();