import type { Schema, Types } from "mongoose";
import type { ICurso } from "../curso/curso.types.js";

export enum Turno{
    MANHA = "MANHA",
    TARDE = "TARDE",
    NOITE = "NOITE"} ;

export interface ITurma {
    capacidade: number;
    turno: Turno;
    dataInicio: Date;
    dataFim: Date;
    curso: ICurso;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateTurmaDTO {
    capacidade?: number;
    turno: Turno;
    dataInicio: string;
    dataFim: string;
    curso: Schema.Types.ObjectId;  
    active?: boolean;
}

export interface IUpdateTurmaDTO {
    capacidade?: number;
    turno?: Turno;
    dataInicio?: string;
    dataFim?: string;
    curso?: Schema.Types.ObjectId;
    active?: boolean;
}