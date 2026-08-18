import Curso from "../curso/curso.model.js";
import Matricula from "../matricula/matricula.model.js";
import { StatusMatricula } from "../matricula/matricula.types.js";
import Turma from "./turma.model.js";
import type { ICreateTurmaDTO, ITurmaMatricula, IUpdateTurmaDTO } from "./turma.types.js";

class TurmaService {
    public async create(data: ICreateTurmaDTO) {
        const curso = await Curso.findById(data.curso); //Evita criar uma turma apontando para um curso que não existe.

        if (!curso) {
            throw new Error("Curso não encontrado");
        }

        if (new Date(data.dataInicio) >= new Date(data.dataFim)) {
            throw new Error("Data de início deve ser anterior à data de fim");
        }

        const turma = await Turma.create({
            capacidade: data.capacidade ?? 35,
            turno: data.turno,
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            curso: curso,
            active: data.active ?? true,
        });

        return await turma.populate("curso");
    }

    public async findAll() {
        const turmas = await Turma.find().populate("curso");

        const turmasMatricula: ITurmaMatricula[] = [];

        for (const turma of turmas) {
            const matriculasAprovadas = await Matricula.countDocuments({
                turma: turma._id,
                status: StatusMatricula.APROVADA,
            });

            turmasMatricula.push({
                turma,
                vagasDisponiveis: turma.capacidade - matriculasAprovadas,
            });
        }

        return turmasMatricula;
    }

    public async findById(id: string) {
        return await Turma.findById(id).populate("curso");
    }

    public async update(id: string, data: IUpdateTurmaDTO) {
        if (data.curso) {
            const curso = await Curso.findById(data.curso); //Evita editar uma turma apontando para um curso que não existe.

            if (!curso) {
                throw new Error("Curso não encontrado");
            }

            if (data.dataInicio && data.dataFim && new Date(data.dataInicio) >= new Date(data.dataFim)) {
                throw new Error("Data de início deve ser anterior à data de fim");
            }
        
        }

        const updateData: any = {};

        if (data.capacidade !== undefined) {
            updateData.capacidade = data.capacidade;
        }

        if (data.turno !== undefined) {
            updateData.turno = data.turno;
        }

        if (data.dataInicio !== undefined) {
            updateData.dataInicio = data.dataInicio;
        }

        if (data.dataFim !== undefined) {
            updateData.dataFim = data.dataFim;
        }

        if (data.curso !== undefined) {
            updateData.curso = data.curso;
        }

        if (data.active !== undefined) {
            updateData.active = data.active;
        }

        return await Turma.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("curso");


    }

    public async delete(id: string) {
        const turma = await Turma.findById(id);

        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        if (!turma.active) {
            throw new Error("Esta turma já está desativada");
        }

        const matriculaAtiva = await Matricula.findOne({
            turma: id,
            active: true
        });

        if (matriculaAtiva) {
            throw new Error("Não é possível desativar uma turma com alunos matriculados ativos.");
        }

        turma.active = false;

        return await turma.save();
    }
}

export default new TurmaService();