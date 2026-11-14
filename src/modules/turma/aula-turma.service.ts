import AulaTurma from "./aula-turma.model.js";
import { StatusAula, type IUpdateAulaTurmaDTO } from "./turma.types.js";
import User from "../user/user.model.js";
import { Papel_usuario } from "../user/user.types.js";
import { AppError } from "../../errors/app-error.js";
import Turma from "./turma.model.js";

class AulaTurmaService {
    public async findAllByTurma(turmaId: string) {
        return await AulaTurma.find({ turma: turmaId })
            .populate("aula")
            .populate("professor", "name email");
    }

    public async update(id: string, data: IUpdateAulaTurmaDTO) {

        const ocorrencia = await AulaTurma.findById(id);
        if (!ocorrencia) {
            throw new AppError("Ocorrência de aula não encontrada.", 404);
        }

        if (data.dataInicio || data.dataFim) {
            const turma = await Turma.findById(ocorrencia.turma)

            if (!turma) {
                throw new AppError("Turma vinculada não encontrada.", 404);
            }

            const aulaInicio = data.dataInicio ? new Date(data.dataInicio) : ocorrencia.dataInicio;
            const aulaFim = data.dataFim ? new Date(data.dataFim) : ocorrencia.dataFim;

            const turmaInicio = new Date(turma.dataInicio);
            const turmaFim = new Date(turma.dataFim);

            if (aulaInicio && aulaInicio < turmaInicio) {
                throw new AppError("A data de início da aula não pode ser anterior à data de início da turma.", 400);
            }

            if (aulaFim && aulaFim > turmaFim) {
                throw new AppError("A data de fim da aula não pode ultrapassar a data de encerramento da turma.", 400);
            }
        }

        if (data.status === StatusAula.REALIZADA) {
            throw new AppError(
                "Finalize a aula pelo fluxo de chamada do professor.",
                400
            );
        }

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