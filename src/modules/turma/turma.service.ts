import Curso from "../curso/curso.model.js";
import Turma from "./turma.model.js";
import type { ICreateTurmaDTO, IUpdateTurmaDTO } from "./turma.types.js";

class TurmaService {
    public async create (data: ICreateTurmaDTO) {
        const curso = await Curso.findById(data.curso); //Evita criar uma turma apontando para um curso que não existe.

        if (!curso){
            throw new Error("Curso não encontrado");
        }

        const turma = await Turma.create({
            capacidade: data.capacidade ?? 35,
            turno: data.turno,
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            curso: data.curso,
            active: data.active ?? true,
        });

        return await turma.populate("curso");
    }

    public async findAll() {
        return await Turma.find().populate("curso");
    }

    public async findById(id: string) {
        return await Turma.findById(id).populate("curso");
    }

    public async update(id: string, data: IUpdateTurmaDTO){
        if (data.curso) {
            const curso = await Curso.findById(data.curso); //Evita editar uma turma apontando para um curso que não existe.

            if (!curso){
                throw new Error ("Curso não encontrado");
            }
        }

        const updateData: any = {};

        if (data.capacidade !== undefined){
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
        return await Turma.findByIdAndDelete(id);
    }
}

export default new TurmaService();