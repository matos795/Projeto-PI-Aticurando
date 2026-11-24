
import type { Types } from "mongoose";

export interface ICertificado {
    matricula: Types.ObjectId;
    aluno: Types.ObjectId;
    turma: Types.ObjectId;
    curso: Types.ObjectId;

    codigoVerificacao: string;

    nomeAluno: string;
    nomeCurso: string;
    turno: string;

    periodoInicio: Date;
    periodoFim: Date;

    cargaHorariaMinutos: number;
    frequenciaPercentual: number;

    presentes: number;
    faltas: number;
    aulasRealizadas: number;

    emitidoPor: Types.ObjectId;
    emitidoEm: Date;
}
