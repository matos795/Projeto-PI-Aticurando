import { isValidObjectId, Types } from "mongoose";

import AulaTurma from "../turma/aula-turma.model.js";
import Matricula from "../matricula/matricula.model.js";

import { StatusMatricula } from "../matricula/matricula.types.js";
import { AppError } from "../../errors/app-error.js";
import Chamada from "./chamada.model.js";

import { StatusPresenca } from "./chamada.types.js";

import type {
    ISalvarChamadaDTO
} from "./chamada.types.js";
import { StatusAula } from "../turma/turma.types.js";
import Aula from "../aula/aula.model.js";

class ChamadaService {

    public async listarAlunosDaAula(
        aulaTurmaId: string,
        professorId: string
    ) {

        if (
            !isValidObjectId(aulaTurmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError(
                "Identificador inválido.",
                400
            );
        }

        const aulaTurma = await AulaTurma.findOne({
            _id: aulaTurmaId,
            professor: professorId
        });

        if (!aulaTurma) {
            throw new AppError(
                "Aula não encontrada ou não atribuída ao professor.",
                404
            );
        }

        const matriculas = await Matricula.find({
            turma: aulaTurma.turma,
            status: StatusMatricula.APROVADA
        })
            .populate("user", "name email")
            .sort({ createdAt: 1 });

        return matriculas;
    }

    public async salvarChamada(
        aulaTurmaId: string,
        professorId: string,
        dados: ISalvarChamadaDTO
    ) {
        if (
            !isValidObjectId(aulaTurmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError("Identificador inválido.", 400);
        }

        const aulaTurma = await AulaTurma.findOne({
            _id: aulaTurmaId,
            professor: professorId
        });

        if (!aulaTurma) {
            throw new AppError(
                "Aula não encontrada ou não atribuída ao professor.",
                404
            );
        }

        if (
            aulaTurma.status !== "AGENDADA" &&
            aulaTurma.status !== "REALIZADA"
        ) {
            throw new AppError(
                "Esta aula não permite registro de chamada.",
                400
            );
        }

        if (!dados || !Array.isArray(dados.registros)) {
            throw new AppError(
                "A lista de presenças é obrigatória.",
                400
            );
        }

        for (const registro of dados.registros) {
            if (
                !registro ||
                typeof registro.matricula !== "string" ||
                !isValidObjectId(registro.matricula) ||
                !Object.values(StatusPresenca).includes(registro.status)
            ) {
                throw new AppError(
                    "Existe um registro de presença inválido.",
                    400
                );
            }
        }

        if (
            dados.observacao !== undefined &&
            typeof dados.observacao !== "string"
        ) {
            throw new AppError("Observação inválida.", 400);
        }

        const observacao = dados.observacao?.trim() ?? "";

        if (observacao.length > 1000) {
            throw new AppError(
                "A observação deve ter no máximo 1000 caracteres.",
                400
            );
        }

        const matriculas = await Matricula.find({
            turma: aulaTurma.turma,
            status: StatusMatricula.APROVADA
        }).select("_id");

        const idsPermitidos = new Set(
            matriculas.map((item) => item._id.toString())
        );

        const idsRecebidos = dados.registros.map(
            (item) => new Types.ObjectId(item.matricula).toString()
        );

        if (new Set(idsRecebidos).size !== idsRecebidos.length) {
            throw new AppError(
                "Existem matrículas duplicadas na chamada.",
                400
            );
        }

        if (
            idsRecebidos.length !== idsPermitidos.size ||
            idsRecebidos.some((id) => !idsPermitidos.has(id))
        ) {
            throw new AppError(
                "A chamada deve conter todos os alunos aprovados desta turma.",
                400
            );
        }

        if (
            !aulaTurma.dataInicio ||
            Number.isNaN(new Date(aulaTurma.dataInicio).getTime())
        ) {
            throw new AppError(
                "A aula ainda não possui um horário de início válido.",
                400
            );
        }

        if (new Date(aulaTurma.dataInicio).getTime() > Date.now()) {
            throw new AppError(
                "Não é possível registrar chamada antes do início da aula.",
                400
            );
        }

        const registros = dados.registros.map((item) => ({
            matricula: new Types.ObjectId(item.matricula),
            status: item.status
        }));

        const chamada = await Chamada.findOneAndUpdate(
            { aulaTurma: aulaTurma._id },
            {
                $set: {
                    professor: new Types.ObjectId(professorId),
                    registros,
                    observacao
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return chamada;
    }

    public async buscarChamada(
        aulaTurmaId: string,
        professorId: string
    ) {
        if (
            !isValidObjectId(aulaTurmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError(
                "Identificador inválido.",
                400
            );
        }

        const aulaTurma = await AulaTurma.findOne({
            _id: aulaTurmaId,
            professor: professorId
        });

        if (!aulaTurma) {
            throw new AppError(
                "Aula não encontrada ou não atribuída ao professor.",
                404
            );
        }

        const chamada = await Chamada.findOne({
            aulaTurma: aulaTurma._id
        });

        return chamada;
    }

    public async calcularFrequenciaDaTurma(
        turmaId: string,
        professorId: string
    ) {
        if (
            !isValidObjectId(turmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError("Identificador inválido.", 400);
        }

        const vinculo = await AulaTurma.exists({
            turma: turmaId,
            professor: professorId
        });

        if (!vinculo) {
            throw new AppError(
                "Turma não encontrada ou não vinculada ao professor.",
                404
            );
        }

        const matriculas = await Matricula.find({
            turma: turmaId,
            status: StatusMatricula.APROVADA
        })
            .select("_id")
            .lean();

        const aulasValidas = await AulaTurma.find({
            turma: turmaId,
            status: StatusAula.REALIZADA
        })
            .select("_id")
            .lean();

        const idsAulas = aulasValidas.map(
            (aula) => aula._id
        );

        const chamadas = await Chamada.find({
            aulaTurma: { $in: idsAulas }
        })
            .select("registros")
            .lean();

        const frequencias = new Map(
            matriculas.map((matricula) => [
                matricula._id.toString(),
                {
                    matriculaId: matricula._id.toString(),
                    presentes: 0,
                    faltas: 0
                }
            ])
        );

        for (const chamada of chamadas) {
            for (const registro of chamada.registros) {

                const matriculaId =
                    registro.matricula.toString();

                const aluno = frequencias.get(matriculaId);

                if (!aluno) continue;

                if (registro.status === "PRESENTE") {
                    aluno.presentes++;
                }

                if (registro.status === "FALTA") {
                    aluno.faltas++;
                }
            }
        }

        return Array.from(frequencias.values()).map((item) => {
            const total = item.presentes + item.faltas;

            const percentual = total > 0
                ? Math.round((item.presentes / total) * 10000) / 100
                : null;

            return {
                ...item,
                aulasContabilizadas: total,
                frequenciaPercentual: percentual
            };
        });
    }

    public async finalizarAula(
        aulaTurmaId: string,
        professorId: string,
        confirmacaoAntecipada = false
    ) {
        if (
            !isValidObjectId(aulaTurmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError("Identificador inválido.", 400);
        }

        const aulaTurma = await AulaTurma.findOne({
            _id: aulaTurmaId,
            professor: professorId
        });

        if (!aulaTurma) {
            throw new AppError(
                "Aula não encontrada para este professor.",
                404
            );
        }

        if (aulaTurma.status !== StatusAula.AGENDADA) {
            throw new AppError(
                "Apenas aulas agendadas podem ser finalizadas.",
                409
            );
        }

        if (!aulaTurma.dataInicio || !aulaTurma.dataFim) {
            throw new AppError(
                "A aula precisa ter início e término definidos.",
                400
            );
        }

        const inicio = new Date(aulaTurma.dataInicio).getTime();
        const fim = new Date(aulaTurma.dataFim).getTime();
        const agora = Date.now();

        if (
            !Number.isFinite(inicio) ||
            !Number.isFinite(fim) ||
            inicio >= fim
        ) {
            throw new AppError(
                "O período da aula é inválido.",
                400
            );
        }

        if (agora < inicio) {
            throw new AppError(
                "A aula ainda não começou.",
                409
            );
        }

        const antecipada = agora < fim;

        if (antecipada && !confirmacaoAntecipada) {
            throw new AppError(
                "A aula ainda não terminou. Confirme a finalização antecipada.",
                409
            );
        }

        const chamada = await Chamada.findOne({
            aulaTurma: aulaTurma._id,
            professor: professorId
        });

        if (!chamada) {
            throw new AppError(
                "Registre a chamada antes de finalizar a aula.",
                400
            );
        }

        const matriculas = await Matricula.find({
            turma: aulaTurma.turma,
            status: StatusMatricula.APROVADA
        })
            .select("_id")
            .lean();

        if (matriculas.length === 0) {
            throw new AppError(
                "Não há alunos aprovados para finalizar esta chamada.",
                400
            );
        }

        const idsAprovados = new Set(
            matriculas.map((m) => m._id.toString())
        );

        const idsRegistrados = new Set<string>();

        for (const registro of chamada.registros) {
            const id = registro.matricula.toString();

            if (
                !idsAprovados.has(id) ||
                idsRegistrados.has(id) ||
                !["PRESENTE", "FALTA"].includes(registro.status)
            ) {
                throw new AppError(
                    "A chamada possui registros inválidos.",
                    400
                );
            }

            idsRegistrados.add(id);
        }

        if (idsRegistrados.size !== idsAprovados.size) {
            throw new AppError(
                "A chamada precisa conter todos os alunos aprovados.",
                400
            );
        }

        const atualizada = await AulaTurma.findOneAndUpdate(
            {
                _id: aulaTurma._id,
                professor: professorId,
                status: StatusAula.AGENDADA
            },
            {
                $set: {
                    status: StatusAula.REALIZADA,
                    finalizadaEm: new Date(),
                    finalizacaoAntecipada: antecipada
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!atualizada) {
            throw new AppError(
                "A aula foi alterada. Atualize a página e tente novamente.",
                409
            );
        }

        return atualizada;
    }

    public async listarHistoricoDaTurma(
        turmaId: string,
        professorId: string
    ) {
        if (
            !isValidObjectId(turmaId) ||
            !isValidObjectId(professorId)
        ) {
            throw new AppError("Identificador inválido.", 400);
        }

        const ocorrencias = await AulaTurma.find({
            turma: turmaId,
            professor: professorId
        })
            .select("_id aula dataInicio dataFim status")
            .lean();

        if (ocorrencias.length === 0) {
            throw new AppError(
                "Turma não vinculada ao professor.",
                404
            );
        }

        const idsOcorrencias = ocorrencias.map(
            (item) => item._id
        );

        const chamadas = await Chamada.find({
            aulaTurma: { $in: idsOcorrencias },
            professor: professorId
        })
            .select("aulaTurma registros observacao createdAt updatedAt")
            .lean();

        const aulas = await Aula.find({
            _id: {
                $in: ocorrencias.map((item) => item.aula)
            }
        })
            .select("_id titulo")
            .lean();

        const titulos = new Map(
            aulas.map((aula) => [
                aula._id.toString(),
                aula.titulo
            ])
        );

        const ocorrenciasPorId = new Map(
            ocorrencias.map((item) => [
                item._id.toString(),
                item
            ])
        );

        const historico = chamadas.flatMap((chamada) => {
            const ocorrencia = ocorrenciasPorId.get(
                chamada.aulaTurma.toString()
            );

            if (!ocorrencia) return [];

            const presentes = chamada.registros.filter(
                (registro) => registro.status === "PRESENTE"
            ).length;

            const faltas = chamada.registros.filter(
                (registro) => registro.status === "FALTA"
            ).length;

            return [{
                aulaTurmaId: ocorrencia._id.toString(),
                titulo: titulos.get(
                    ocorrencia.aula.toString()
                ) ?? "Aula sem título",
                dataInicio: ocorrencia.dataInicio ?? null,
                dataFim: ocorrencia.dataFim ?? null,
                status: ocorrencia.status,
                presentes,
                faltas,
                observacao: chamada.observacao ?? "",
                criadaEm: chamada.createdAt ?? null,
                atualizadaEm: chamada.updatedAt ?? null
            }];
        });

        return historico.sort((a, b) =>
            new Date(b.dataInicio ?? 0).getTime() -
            new Date(a.dataInicio ?? 0).getTime()
        );
    }
}

export default new ChamadaService();