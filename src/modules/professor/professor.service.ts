import AulaTurma from "../turma/aula-turma.model.js";

import { isValidObjectId } from "mongoose";

import Chamada from "../chamada/chamada.model.js";
import { AppError } from "../../errors/app-error.js";

interface IFiltrosMinhasAulas {
    status: string;
    turmaId?: string;
}

class ProfessorService {
    public async listarMinhasAulas(professorId: string, filtros: IFiltrosMinhasAulas) {
        const query: any = {
            professor: professorId
        };

        if (filtros.status) {
            query.status = filtros.status;
        }

        if (filtros.turmaId) {
            query.turma = filtros.turmaId;
        }

        const minhasAulas = await AulaTurma.find(query)
            .sort({ dataInicio: 1 })
            .populate("aula")
            .populate({
                path: "turma",
                populate: { path: "curso", select: "name" }
            });

        return minhasAulas
    }

    public async listarResumoChamadas(professorId: string) {

        if (!isValidObjectId(professorId)) {
            throw new AppError(
                "Identificador do professor inválido.",
                400
            );
        }

        const aulas = await AulaTurma.find({
            professor: professorId
        })
            .select("_id")
            .lean();

        const idsAulas = aulas.map((aula) => aula._id);

        const chamadas = await Chamada.find({
            professor: professorId,
            aulaTurma: { $in: idsAulas }
        })
            .select("aulaTurma updatedAt")
            .lean();

        return chamadas.map((chamada) => ({
            aulaTurmaId: chamada.aulaTurma.toString(),
            atualizadoEm: chamada.updatedAt?.toISOString() ?? null
        }));
    }
}

export default new ProfessorService();