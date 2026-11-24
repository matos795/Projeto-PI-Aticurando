
import { isValidObjectId } from "mongoose";

import Turma from "../turma/turma.model.js";
import Curso from "../curso/curso.model.js";
import Aula from "../aula/aula.model.js";
import AulaTurma from "../turma/aula-turma.model.js";
import Matricula from "../matricula/matricula.model.js";
import Chamada from "../chamada/chamada.model.js";
import User from "../user/user.model.js";

import { StatusAula } from "../turma/turma.types.js";
import { StatusMatricula } from "../matricula/matricula.types.js";
import { StatusPresenca } from "../chamada/chamada.types.js";
import { AppError } from "../../errors/app-error.js";

export const FREQUENCIA_MINIMA_CERTIFICADO = 75;

interface ResumoPresenca {
    presentes: number;
    faltas: number;
    aulasRegistradas: Set<string>;
    registrosDuplicados: boolean;
}

class CertificadoService {
    public async consultarElegibilidade(turmaId: string) {
        if (!isValidObjectId(turmaId)) {
            throw new AppError("Identificador da turma inválido.", 400);
        }

        const turma = await Turma.findById(turmaId)
            .select("curso turno")
            .lean();

        if (!turma) {
            throw new AppError("Turma não encontrada.", 404);
        }

        const [curso, ocorrencias, matriculas] = await Promise.all([
            Curso.findById(turma.curso)
                .select("name")
                .lean(),

            AulaTurma.find({ turma: turmaId })
                .select("_id aula status")
                .lean(),

            Matricula.find({
                turma: turmaId,
                status: StatusMatricula.APROVADA
            })
                .select("_id user")
                .lean()
        ]);

        if (!curso) {
            throw new AppError(
                "Curso vinculado à turma não encontrado.",
                404
            );
        }

        const obrigatorias = ocorrencias.filter(
            (item) => item.status !== StatusAula.CANCELADA
        );

        const realizadas = obrigatorias.filter(
            (item) => item.status === StatusAula.REALIZADA
        );

        const [aulas, chamadas, usuarios] = await Promise.all([
            Aula.find({
                _id: { $in: obrigatorias.map((item) => item.aula) }
            })
                .select("_id duracao")
                .lean(),

            Chamada.find({
                aulaTurma: {
                    $in: realizadas.map((item) => item._id)
                }
            })
                .select("aulaTurma registros")
                .lean(),

            User.find({
                _id: { $in: matriculas.map((item) => item.user) }
            })
                .select("_id name email")
                .lean()
        ]);

        const duracoes = new Map(
            aulas.map((aula) => [
                aula._id.toString(),
                aula.duracao
            ])
        );

        const cargaHorariaValida = obrigatorias.every((item) => {
            const duracao = duracoes.get(item.aula.toString());

            return (
                typeof duracao === "number" &&
                Number.isFinite(duracao) &&
                duracao > 0
            );
        });

        const cargaHorariaMinutos = obrigatorias.reduce(
            (total, item) =>
                total + (duracoes.get(item.aula.toString()) ?? 0),
            0
        );

        const todasRealizadas =
            obrigatorias.length > 0 &&
            realizadas.length === obrigatorias.length;

        const chamadasPorAula = new Map(
            chamadas.map((chamada) => [
                chamada.aulaTurma.toString(),
                chamada
            ])
        );

        const chamadasRegistradas = realizadas.every(
            (item) => chamadasPorAula.has(item._id.toString())
        );

        const turmaConcluida =
            todasRealizadas &&
            chamadasRegistradas &&
            cargaHorariaValida;

        const frequencias = new Map<string, ResumoPresenca>(
            matriculas.map((matricula) => [
                matricula._id.toString(),
                {
                    presentes: 0,
                    faltas: 0,
                    aulasRegistradas: new Set<string>(),
                    registrosDuplicados: false
                }
            ])
        );

        for (const chamada of chamadas) {
            const aulaId = chamada.aulaTurma.toString();

            for (const registro of chamada.registros) {
                const matriculaId = registro.matricula.toString();
                const resumo = frequencias.get(matriculaId);

                if (!resumo) {
                    continue;
                }

                if (resumo.aulasRegistradas.has(aulaId)) {
                    resumo.registrosDuplicados = true;
                    continue;
                }

                if (
                    registro.status !== StatusPresenca.PRESENTE &&
                    registro.status !== StatusPresenca.FALTA
                ) {
                    resumo.registrosDuplicados = true;
                    continue;
                }

                resumo.aulasRegistradas.add(aulaId);

                if (registro.status === StatusPresenca.PRESENTE) {
                    resumo.presentes++;
                } else {
                    resumo.faltas++;
                }
            }
        }

        const usuariosPorId = new Map(
            usuarios.map((usuario) => [
                usuario._id.toString(),
                usuario
            ])
        );

        const alunos = matriculas.map((matricula) => {
            const matriculaId = matricula._id.toString();
            const alunoId = matricula.user.toString();

            const usuario = usuariosPorId.get(alunoId);

            const resumo = frequencias.get(matriculaId);

            const presentes = resumo?.presentes ?? 0;
            const faltas = resumo?.faltas ?? 0;

            const aulasContabilizadas = presentes + faltas;

            const frequenciaPercentual =
                aulasContabilizadas > 0
                    ? Math.round(
                        (presentes / aulasContabilizadas) * 10000
                    ) / 100
                    : null;

            const registrosCompletos =
                !resumo?.registrosDuplicados &&
                resumo?.aulasRegistradas.size === obrigatorias.length;

            const motivos: string[] = [];

            if (!turmaConcluida) {
                motivos.push(
                    "A turma ainda não concluiu todas as aulas obrigatórias ou possui dados acadêmicos incompletos."
                );
            }

            if (!usuario) {
                motivos.push(
                    "Dados do aluno não encontrados."
                );
            }

            if (!registrosCompletos) {
                motivos.push(
                    "O aluno não possui registros válidos em todas as aulas obrigatórias."
                );
            }

            if (
                frequenciaPercentual === null ||
                frequenciaPercentual < FREQUENCIA_MINIMA_CERTIFICADO
            ) {
                motivos.push(
                    `Frequência inferior ao mínimo de ${FREQUENCIA_MINIMA_CERTIFICADO}%.`
                );
            }

            return {
                matriculaId,
                alunoId,
                nome: usuario?.name ?? "Aluno não encontrado",
                email: usuario?.email ?? null,
                presentes,
                faltas,
                aulasContabilizadas,
                frequenciaPercentual,
                elegivel: motivos.length === 0,
                motivos
            };
        });

        alunos.sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR")
        );

        return {
            turma: {
                id: turmaId,
                curso: curso.name,
                turno: turma.turno
            },
            frequenciaMinima: FREQUENCIA_MINIMA_CERTIFICADO,
            resumo: {
                aulasObrigatorias: obrigatorias.length,
                aulasRealizadas: realizadas.length,
                aulasCanceladas:
                    ocorrencias.length - obrigatorias.length,
                cargaHorariaMinutos,
                cargaHorariaHoras: Math.round(
                    (cargaHorariaMinutos / 60) * 100
                ) / 100,
                cargaHorariaValida,
                turmaConcluida,
                alunosAprovados: matriculas.length,
                alunosElegiveis: alunos.filter(
                    (aluno) => aluno.elegivel
                ).length
            },
            alunos
        };
    }
}

export default new CertificadoService();