import type { Schema, Types } from "mongoose";
import type { ICurso } from "../curso/curso.types.js";

export enum Turno{
    MANHA = "MANHA",
    TARDE = "TARDE",
    NOITE = "NOITE"} ;

export enum StatusAula {
    PENDENTE = "PENDENTE",
    AGENDADA = "AGENDADA",
    REALIZADA = "REALIZADA",
    CANCELADA = "CANCELADA"
} 

export interface IAulaTurma extends Document {
    aula: Types.ObjectId;
    turma: Types.ObjectId;
    dataInicio: Date;
    dataFim: Date;
    professor: Types.ObjectId;
    status: StatusAula;
}

export interface ITurma {
    capacidade: number;
    turno: Turno;
    dataInicio: Date;
    dataFim: Date;
    curso: Types.ObjectId | ICurso;
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

export interface ITurmaMatricula {
    turma: ITurma;
    vagasDisponiveis: number;
}
