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

export interface IEditarAuthUser {
    name: string;
    email: string;
}