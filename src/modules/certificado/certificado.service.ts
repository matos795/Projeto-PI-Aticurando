
import { isValidObjectId, Types } from "mongoose";

import Turma from "../turma/turma.model.js";
import Curso from "../curso/curso.model.js";
import Aula from "../aula/aula.model.js";
import AulaTurma from "../turma/aula-turma.model.js";
import Matricula from "../matricula/matricula.model.js";
import Chamada from "../chamada/chamada.model.js";
import User from "../user/user.model.js";

import { randomBytes } from "node:crypto";
import Certificado from "./certificado.model.js";
import { Papel_usuario } from "../user/user.types.js";

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

interface MatriculaParaCertificado {
    _id: Types.ObjectId;
    user: Types.ObjectId;
}

interface ChamadaParaCertificado {
    aulaTurma: Types.ObjectId;
    registros: Array<{
        matricula: Types.ObjectId;
        status: StatusPresenca;
    }>;
}

interface UsuarioParaCertificado {
    _id: Types.ObjectId;
    name: string;
    email: string;
}

function registrarPresenca(
    resumo: ResumoPresenca | undefined,
    aulaId: string,
    status: StatusPresenca
): void {
    if (!resumo) {
        return;
    }

    if (resumo.aulasRegistradas.has(aulaId)) {
        resumo.registrosDuplicados = true;
        return;
    }

    if (
        status !== StatusPresenca.PRESENTE &&
        status !== StatusPresenca.FALTA
    ) {
        resumo.registrosDuplicados = true;
        return;
    }

    resumo.aulasRegistradas.add(aulaId);

    if (status === StatusPresenca.PRESENTE) {
        resumo.presentes++;
    } else {
        resumo.faltas++;
    }
}

function consolidarPresencas(
    matriculas: MatriculaParaCertificado[],
    chamadas: ChamadaParaCertificado[]
): Map<string, ResumoPresenca> {
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
            const resumo = frequencias.get(
                registro.matricula.toString()
            );

            registrarPresenca(
                resumo,
                aulaId,
                registro.status
            );
        }
    }

    return frequencias;
}

function avaliarAlunosParaCertificado(
    matriculas: MatriculaParaCertificado[],
    usuarios: UsuarioParaCertificado[],
    frequencias: Map<string, ResumoPresenca>,
    turmaConcluida: boolean,
    aulasObrigatorias: number
) {
    const usuariosPorId = new Map(
        usuarios.map((usuario) => [usuario._id.toString(), usuario])
    );

    return matriculas.map((matricula) => {
        const matriculaId = matricula._id.toString();
        const alunoId = matricula.user.toString();
        const usuario = usuariosPorId.get(alunoId);
        const resumo = frequencias.get(matriculaId);

        const presentes = resumo?.presentes ?? 0;
        const faltas = resumo?.faltas ?? 0;
        const aulasContabilizadas = presentes + faltas;
        const frequenciaPercentual = aulasContabilizadas > 0
            ? Math.round((presentes / aulasContabilizadas) * 10000) / 100
            : null;

        const registrosCompletos =
            !resumo?.registrosDuplicados &&
            resumo?.aulasRegistradas.size === aulasObrigatorias;

        const motivos: string[] = [];
        if (!turmaConcluida) {
            motivos.push(
                'A turma ainda não concluiu todas as aulas obrigatórias ou possui dados acadêmicos incompletos.'
            );
        }
        if (!usuario) {
            motivos.push('Dados do aluno não encontrados.');
        }
        if (!registrosCompletos) {
            motivos.push('O aluno não possui registros válidos em todas as aulas obrigatórias.');
        }
        if (
            frequenciaPercentual === null ||
            frequenciaPercentual < FREQUENCIA_MINIMA_CERTIFICADO
        ) {
            motivos.push(`Frequência inferior ao mínimo de ${FREQUENCIA_MINIMA_CERTIFICADO}%.`);
        }

        return {
            matriculaId,
            alunoId,
            nome: usuario?.name ?? 'Aluno não encontrado',
            email: usuario?.email ?? null,
            presentes,
            faltas,
            aulasContabilizadas,
            frequenciaPercentual,
            elegivel: motivos.length === 0,
            motivos
        };
    });
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

        const frequencias = consolidarPresencas(
            matriculas,
            chamadas
        );

        const alunos = avaliarAlunosParaCertificado(
            matriculas,
            usuarios,
            frequencias,
            turmaConcluida,
            obrigatorias.length
        );

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


    public async emitir(
        matriculaId: string,
        administradorId: string
    ) {
        if (
            !isValidObjectId(matriculaId) ||
            !isValidObjectId(administradorId)
        ) {
            throw new AppError(
                "Identificador de matrícula ou administrador inválido.",
                400
            );
        }

        const existente = await Certificado.findOne({
            matricula: matriculaId
        });

        if (existente) {
            return {
                certificado: existente,
                criado: false
            };
        }

        const matricula = await Matricula.findById(matriculaId)
            .select("_id user turma status")
            .lean();

        if (!matricula) {
            throw new AppError(
                "Matrícula não encontrada.",
                404
            );
        }

        if (matricula.status !== StatusMatricula.APROVADA) {
            throw new AppError(
                "A matrícula não está aprovada.",
                409
            );
        }

        const turma = await Turma.findById(matricula.turma)
            .select("curso dataInicio dataFim")
            .lean();

        if (!turma) {
            throw new AppError(
                "Turma não encontrada.",
                404
            );
        }

        const resultado = await this.consultarElegibilidade(
            matricula.turma.toString()
        );

        const aluno = resultado.alunos.find(
            (item) => item.matriculaId === matriculaId
        );

        if (
            !aluno ||
            !aluno.elegivel ||
            aluno.frequenciaPercentual === null
        ) {
            throw new AppError(
                "O aluno ainda não atende aos requisitos para emissão. Consulte a elegibilidade.",
                409
            );
        }

        if (resultado.resumo.cargaHorariaMinutos <= 0) {
            throw new AppError(
                "A carga horária do curso é inválida.",
                409
            );
        }

        const codigoVerificacao = randomBytes(16)
            .toString("hex")
            .toUpperCase();

        try {
            const certificado = await Certificado.create({
                matricula: matricula._id,
                aluno: matricula.user,
                turma: matricula.turma,
                curso: turma.curso as Types.ObjectId,

                codigoVerificacao,

                nomeAluno: aluno.nome,
                nomeCurso: resultado.turma.curso,
                turno: resultado.turma.turno,

                periodoInicio: turma.dataInicio,
                periodoFim: turma.dataFim,

                cargaHorariaMinutos:
                    resultado.resumo.cargaHorariaMinutos,

                frequenciaPercentual:
                    aluno.frequenciaPercentual,

                presentes: aluno.presentes,
                faltas: aluno.faltas,
                aulasRealizadas:
                    resultado.resumo.aulasRealizadas,

                emitidoPor: administradorId,
                emitidoEm: new Date()
            });

            return {
                certificado,
                criado: true
            };

        } catch (error) {
            if ((error as { code?: number } | null)?.code === 11000) {
                const emitido = await Certificado.findOne({
                    matricula: matriculaId
                });

                if (emitido) {
                    return {
                        certificado: emitido,
                        criado: false
                    };
                }

                throw new AppError(
                    "Não foi possível reservar um código de certificado. Tente novamente.",
                    409
                );
            }

            throw error;
        }
    }


    public async listarEmitidosDaTurma(turmaId: string) {
        if (!isValidObjectId(turmaId)) {
            throw new AppError(
                "Identificador da turma inválido.",
                400
            );
        }

        const turmaExiste = await Turma.exists({
            _id: turmaId
        });

        if (!turmaExiste) {
            throw new AppError(
                "Turma não encontrada.",
                404
            );
        }

        return Certificado.find({
            turma: turmaId
        })
            .select(
                "_id matricula aluno nomeAluno nomeCurso " +
                "cargaHorariaMinutos frequenciaPercentual " +
                "codigoVerificacao emitidoEm"
            )
            .sort({ emitidoEm: -1 })
            .lean();
    }

    public listarMeus(alunoId: string) {
        if (!isValidObjectId(alunoId)) {
            throw new AppError(
                "Identificador do aluno inválido.",
                400
            );
        }

        return Certificado.find({
            aluno: alunoId
        })
            .select(
                "_id nomeAluno nomeCurso turno " +
                "periodoInicio periodoFim " +
                "cargaHorariaMinutos frequenciaPercentual " +
                "codigoVerificacao emitidoEm"
            )
            .sort({ emitidoEm: -1 })
            .lean();
    }

    public async obterParaDownload(
        certificadoId: string,
        usuarioId: string,
        papelUsuario: Papel_usuario
    ) {
        if (
            !isValidObjectId(certificadoId) ||
            !isValidObjectId(usuarioId)
        ) {
            throw new AppError(
                "Identificador inválido.",
                400
            );
        }

        if (
            papelUsuario !== Papel_usuario.ADM &&
            papelUsuario !== Papel_usuario.ALUNO
        ) {
            throw new AppError(
                "Acesso não autorizado.",
                403
            );
        }

        const certificado = await Certificado.findById(
            certificadoId
        ).lean();

        if (!certificado) {
            throw new AppError(
                "Certificado não encontrado.",
                404
            );
        }

        // Alunos só podem baixar os próprios certificados
        if (
            papelUsuario === Papel_usuario.ALUNO &&
            certificado.aluno.toString() !== usuarioId
        ) {
            throw new AppError(
                "Certificado não encontrado.",
                404
            );
        }

        return certificado;
    }

    public async validarAutenticidade(codigoRecebido: string) {
        const codigo = codigoRecebido.trim().toUpperCase();

        // randomBytes(16) gera 32 caracteres hexadecimais
        if (!/^[A-F0-9]{32}$/.test(codigo)) {
            return { valido: false };
        }

        const certificado = await Certificado.findOne({
            codigoVerificacao: codigo
        })
            .select(
                "nomeAluno nomeCurso cargaHorariaMinutos " +
                "codigoVerificacao emitidoEm"
            )
            .lean();

        if (!certificado) {
            return { valido: false };
        }

        return {
            valido: true,
            codigoVerificacao: certificado.codigoVerificacao,
            nomeAluno: certificado.nomeAluno,
            nomeCurso: certificado.nomeCurso,
            cargaHorariaHoras:
                Math.round(
                    (certificado.cargaHorariaMinutos / 60) * 100
                ) / 100,
            emitidoEm: certificado.emitidoEm
        };
    }
}

export default new CertificadoService();