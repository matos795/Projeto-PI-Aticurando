import type { Types } from "mongoose"

export interface IAula {
    titulo: string;
    descricao: string;
    duracao: number;
    materiaId: Types.ObjectId;
    ordem: number;
    active: boolean;
    createAt?: Date;
    updateAt?: Date;
}

export interface ICreateAulaDTO {
    titulo: string;
    descricao: string;
    duracao: number;
    materiaId: string;
    ordem: number;
    active?: boolean;
}

export interface IUpdateAulaDTO {
    titulo?: string;
    descricao?: string;
    duracao?: number;
    materiaId?: string;
    ordem?: number;
    active?: boolean;
}