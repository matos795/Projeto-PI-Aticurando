import type { Types } from "mongoose";

export type Turno = "MANHA" | "TARDE" | "NOITE";

export interface ITurma {
    capacidade: number;
    turno: Turno;
    dataInicio: Date;
    dataFim: Date;
    curso: Types.ObjectId;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateTurmaDTO {
    capacidade?: number;
    turno: Turno;
    dataInicio: string;
    dataFim: string;
    curso: string;
    active?: boolean;
}

export interface IUpdateTurmaDTO {
    capacidade?: number;
    turno?: Turno;
    dataInicio?: string;
    dataFim?: string;
    curso?: string;
    active?: boolean;
}