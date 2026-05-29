import type { Types } from "mongoose";

export enum StatusMatricula {
    PENDENTE = "PENDENTE",
    APROVADA = "APROVADA",
    RECUSADA = "RECUSADA",
    CANCELADA = "CANCELADA"
};

export interface IMatricula{
    user: Types.ObjectId;
    turma: Types.ObjectId;
    dataHora: Date;
    frequencia: number;
    status: StatusMatricula;
    motivoCancelamento?: String;
    createAt?: Date;
    updateAt?: Date;
}

export interface ICreateMatriculaDTO{
    turma: string;
}

export interface ICreateMatriculaServiceDTO {
    user: string;
    turma: string;
}

export interface IUpdateMatriculaDTO{
    frequencia?: number;
    status?: StatusMatricula;
    motivoCancelamento?: string;
}

/*export interface IAprovarMatricula{
    status?: StatusMatricula;
}

export interface ICancelarMatricula{
    motivoCancelamento?: string;
}*/