import Curso from "../curso/curso.model.js";
import Matricula from "../matricula/matricula.model.js";
import { StatusMatricula } from "../matricula/matricula.types.js";
import Turma from "../turma/turma.model.js";
import type { IDashboard } from "./dashboard.types.js";

class DashboardService {

    public async findAll(){
        const dashboard: IDashboard = {
            totalMatriculas: await Matricula.find({active: true}).countDocuments(),
            totalCursos: await Curso.find({active: true}).countDocuments(),
            totalTurmas: await Turma.find({active: true}).countDocuments(),
            matriculasAtivas: await Matricula.find({status: StatusMatricula.APROVADA, active: true}).countDocuments(),
            matriculasRecusadas: await Matricula.find({status: StatusMatricula.RECUSADA, active: true}).countDocuments(),
            matriculasPendentes: await Matricula.find({status: StatusMatricula.PENDENTE, active: true}).countDocuments(),
            matriculasCanceladas: await Matricula.find({status: StatusMatricula.CANCELADA, active: true}).countDocuments(),
            turmasInativas: await Turma.find({active: false}).countDocuments(),
            cursosInativos: await Curso.find({active: false}).countDocuments()
        }
        return dashboard;
    }
}

export default new DashboardService();