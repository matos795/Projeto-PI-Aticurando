import type { ICurso } from "../curso/curso.types.js";
import type { Types } from "mongoose";
export type Turno = "MANHA" | "TARDE" | "NOITE";

export interface ITurma {
    capacidade: number;
    turno: Turno;
    data_inicio: Date;
    data_fim: Date;
    active: boolean;
    curso: Types.ObjectId;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateTurmaDTO{
    capacidade: number;
    turno: Turno;
    data_inicio: Date;
    data_fim: Date;
    curso: string;
    active?: boolean;
}

export interface IUpdateTurmaDTO{
    capacidade?: number;
    turno?: Turno;
    data_inicio?: Date;
    data_fim?: Date;
    curso?: string;
    active?:boolean;
}
