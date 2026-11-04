import AulaTurma from "./aula-turma.model.js";
import type { IUpdateAulaTurmaDTO } from "./turma.types.js";
import User from "../user/user.model.js";
import { Papel_usuario } from "../user/user.types.js";

class AulaTurmaService{
    public async findAllByTurma(turmaId: string){
        return await AulaTurma.find({turma: turmaId})
            .populate("aula")
            .populate("professor", "name email");
    }

    public async update (id: string, data: IUpdateAulaTurmaDTO){

        if (data.professor) {
            const professor = await User.findById(data.professor);
            
            if (!professor) {
                throw new Error("Usuário não encontrado.");
            }
            
            if (professor.papelUsuario !== Papel_usuario.PROFESSOR) {
                throw new Error("O usuário selecionado não possui permissão de PROFESSOR.");
            }
        }
        
        return await AulaTurma.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
        .populate("aula")
        .populate("professor", "name email")
    }
}

export default new AulaTurmaService