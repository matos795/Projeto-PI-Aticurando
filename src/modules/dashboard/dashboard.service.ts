import Curso from "../curso/curso.model.js";
import Matricula from "../matricula/matricula.model.js";
import { StatusMatricula } from "../matricula/matricula.types.js";
import Turma from "../turma/turma.model.js";
import type { IDashboard } from "./dashboard.types.js";

class DashboardService {

    public async findAll(){
        const dashboard: IDashboard = {
            totalMatriculas: await Matricula.find().countDocuments(),
            totalCursos: await Curso.find().countDocuments(),
            totalTurmas: await Turma.find().countDocuments(),
            matriculasAtivas: await Matricula.find({status: StatusMatricula.APROVADA}).countDocuments(),
            matriculasRecusadas: await Matricula.find({status: StatusMatricula.RECUSADA}).countDocuments(),
            matriculasPendentes: await Matricula.find({status: StatusMatricula.PENDENTE}).countDocuments(),
            matriculasCanceladas: await Matricula.find({status: StatusMatricula.CANCELADA}).countDocuments(),
            turmasInativas: await Turma.find({active: false}).countDocuments(),
            cursosInativos: await Curso.find({active: false}).countDocuments()
        }
        return dashboard;
    }
}

export default new DashboardService();