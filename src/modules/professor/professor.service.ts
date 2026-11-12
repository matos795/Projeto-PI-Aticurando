import AulaTurma from "../turma/aula-turma.model.js";

interface IFiltrosMinhasAulas{
    status: string;
    turmaId?: string;
}

class ProfessorService {
    public async listarMinhasAulas(professorId: string, filtros: IFiltrosMinhasAulas){
        const query: any = {
            professor: professorId
        };

        if (filtros.status){
            query.status = filtros.status;
        }

        if (filtros.turmaId){
            query.turma = filtros.turmaId;
        }

        const minhasAulas = await AulaTurma.find(query)
        .sort({ dataInicio: 1})
        .populate("aula")
        .populate({
            path: "turma",
            populate: {path: "curso", select: "name"}
        });

        return minhasAulas
    }
}

export default new ProfessorService();