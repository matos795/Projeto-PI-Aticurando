import type { Turno } from "../turma/turma.types.js";

export interface IRegisterDTO {
    name: string;
    cpf: number;
    email: string;
    senha: string;
}

export interface ILoginDTO {
    email: string;
    senha: string;
}

export interface IRegisterCursoDTO {
    name: string;
    description: string;
    materias: IAuthMateria[];
}

export interface IAuthMateria {
    name: string;
    description: string;
}

export interface IRegisterTurmaDTO {
    turno: Turno;
    curso: string;
    dataInicio: string;
    dataFim: string;
    capacidade: number;
}

export interface IEditarAuthUser {
    name: string;
    email: string;
}