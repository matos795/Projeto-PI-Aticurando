import type { Types } from "mongoose";

export enum StatusPresenca {
    PRESENTE = "PRESENTE",
    FALTA = "FALTA"
}

export interface IRegistroPresenca {
    matricula: Types.ObjectId;
    status: StatusPresenca;
}

export interface IChamada {
    aulaTurma: Types.ObjectId;
    professor: Types.ObjectId;
    registros: IRegistroPresenca[];
    observacao?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRegistroPresencaDTO {
    matricula: string;
    status: StatusPresenca;
}

export interface ISalvarChamadaDTO {
    registros: IRegistroPresencaDTO[];
    observacao?: string;
}