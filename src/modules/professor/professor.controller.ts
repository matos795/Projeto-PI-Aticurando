import type { Response } from "express";
import type { RequestAutenticado } from "../../types/request.types.js"; 
import professorService from "./professor.service.js";

class ProfessorController {
    public async listarMinhasAulas(request: RequestAutenticado, response: Response): Promise<Response> {
        try {
            // 1. Extração segura do ID injetado pelo requireAuth
            const professorId = request.user?.id;

            if (!professorId) {
                return response.status(401).json({ message: "Usuário não autenticado" });
            }

            // 2. Captura dos filtros dinâmicos na URL (?status=AGENDADA&turmaId=123)
            const { status, turmaId } = request.query;
            const statusFiltro = typeof status === "string" ? status : "";
            const turmaIdFiltro = typeof turmaId === "string" ? turmaId : "";

            // 3. Execução da busca no Service
            const minhasAulas = await professorService.listarMinhasAulas(professorId, {
                status: statusFiltro,
                turmaId: turmaIdFiltro
            });

            // 4. Retorno dos dados formatados para o Frontend
            return response.status(200).json(minhasAulas);
            
        } catch (error: any) {
            return response.status(400).json({ error: error.message || "Erro ao buscar a agenda do professor." });
        }
    }
}

export default new ProfessorController();