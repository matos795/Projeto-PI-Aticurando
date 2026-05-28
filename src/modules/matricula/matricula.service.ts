import User from "../user/user.model.js";
import Turma from "../turma/turma.model.js";
import Matricula from "./matricula.model.js";
import type { ICreateMatriculaDTO, IUpdateMatriculaDTO } from "./matricula.types.js";

class matriculaService {
    public async create (data: ICreateMatriculaDTO){
        const userExistente = await User.findById(data.user);

        if (!userExistente){
            throw new Error ("Usuário não encontrado!")
        }

        if (userExistente.papelUsuario !== "ALUNO"){
            throw new Error ("Apenas usuários do tipo ALUNO podem possuir matrícula");
        }

        const turmaExistente = await Turma.findById(data.turma);

        if (!turmaExistente){
            throw new Error ("Turma não encontrada!")
        }

        const matriculaExistente = await Matricula.findOne({
            user: data.user,
            turma: data.turma,
        });

        if (matriculaExistente){
            throw new Error(
                "Usuário já possui solicitação para essa turma"
            );
        }

        const matricula = await Matricula.create({
            user: data.user,
            turma: data.turma,
            status: "Pendente",
            frequencia: 0,
        });

        return await matricula.populate([ //A utilização do path ajuda a trazer as informações do usuario e da turma
            {
                path: "usuario",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async findAll(){
        return await Matricula.find().populate([
            {
                path: "user",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async findById(id: string)
    {
        return await Matricula.findById(id).populate([
            {
                path: "usuario",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    };

     public async update(id: string,data: IUpdateMatriculaDTO) {
        const updateData: any = {};

        if (data.frequencia !== undefined) {
            updateData.frequencia = data.frequencia;
        }

        if (data.status !== undefined) {
            updateData.status = data.status;
        }

        if (data.motivoCancelamento !== undefined) {
            updateData.motivoCancelamento =
                data.motivoCancelamento;
        }

        return await Matricula.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate([
            {
                path: "usuario",
            },
            {
                path: "turma",
                populate: {
                    path: "curso",
                },
            },
        ]);
    }

    public async delete (id: string)
    {
        return await Matricula.findByIdAndDelete(id);
    }
}

export default new matriculaService();