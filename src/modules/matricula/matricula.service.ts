import User from "../user/user.model.js";
import { Papel_usuario } from "../user/user.types.js";
import Turma from "../turma/turma.model.js";
import Matricula from "./matricula.model.js";
import {
    StatusMatricula,
    type ICreateMatriculaDTO,
    type IUpdateMatriculaDTO,
} from "./matricula.types.js";

class MatriculaService {
    public async create(data: ICreateMatriculaDTO) {
        const userExistente = await User.findById(data.user);

        if (!userExistente) {
            throw new Error("Usuário não encontrado");
        }

        if (!userExistente.active) {
            throw new Error("Usuário inativo não pode solicitar matrícula");
        }

        if (userExistente.papelUsuario !== Papel_usuario.ALUNO) {
            throw new Error("Apenas alunos podem solicitar matrícula");
        }

        const turmaExistente = await Turma.findById(data.turma);

        if (!turmaExistente) {
            throw new Error("Turma não encontrada");
        }

        if (!turmaExistente.active) {
            throw new Error("Não é possível solicitar matrícula em turma inativa");
        }

        const matriculaExistente = await Matricula.findOne({
            user: data.user,
            turma: data.turma,
            status: {
                $in: [
                    StatusMatricula.PENDENTE,
                    StatusMatricula.APROVADA,
                ],
            },
        });

        if (matriculaExistente) {
            throw new Error(
                "Você já possui matrícula pendente ou aprovada para essa turma",
            );
        }

        const matricula = await Matricula.create({
            user: data.user,
            turma: data.turma,
        });

        return await matricula.populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async findAll() {
        return await Matricula.find().populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async findByAluno(userId: string) {
        return await Matricula.find({ user: userId }).populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async findById(id: string) {
        return await Matricula.findById(id).populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async update(id: string, data: IUpdateMatriculaDTO) {
        const updateData: IUpdateMatriculaDTO = {};

        if (data.frequencia !== undefined) {
            updateData.frequencia = data.frequencia;
        }

        if (data.status !== undefined) {
            updateData.status = data.status;
        }

        if (data.motivoCancelamento !== undefined) {
            updateData.motivoCancelamento = data.motivoCancelamento;
        }

        return await Matricula.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async delete(id: string) {
        return await Matricula.findByIdAndDelete(id);
    }



    public async aprovarMatricula(id: string) {
        const matricula = await Matricula.findById(id);

        if (!matricula) {
            throw new Error("Matrícula não encontrada");
        }

        if (matricula.status !== StatusMatricula.PENDENTE) {
            throw new Error("Apenas matrículas pendentes podem ser aprovadas");
        }

        const turma = await Turma.findById(matricula.turma);

        if (!turma) {
            throw new Error("Turma não encontrada");
        }

        if (!turma.active) {
            throw new Error("Não é possível aprovar matrícula para turma inativa");
        }

        const matriculasAprovadas = await Matricula.countDocuments({
            turma: matricula.turma,
            status: StatusMatricula.APROVADA,
        });

        if (matriculasAprovadas >= turma.capacidade) {
            throw new Error("Não há vagas disponíveis para essa turma");
        }

        matricula.status = StatusMatricula.APROVADA;

        await matricula.save();

        return await matricula.populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async recusarMatricula(id: string){
        const matricula = await Matricula.findById(id);

        if (!matricula) {
            throw new Error("Matrícula não encontrada");
        }

        if (matricula.status !== StatusMatricula.PENDENTE) {
            throw new Error("Apenas matrículas pendentes podem ser recusadas");
        }

        matricula.status = StatusMatricula.RECUSADA;

        await matricula.save();

        return await matricula.populate([
            {
                path: "user",
                select: "name cpf email papelUsuario active",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    
}
export default new MatriculaService();