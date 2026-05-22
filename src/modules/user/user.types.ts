import type {Types} from "mongoose"

export enum Papel_usuario {"ADM", "ALUNO", "PROFESSOR"}

export interface IUser {
    name: string;
    cpf: number;
    email: string;
    senha: string;
    papelUsuario: Papel_usuario;
    active: boolean;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateUserDTO{
    name: string;
    cpf: number;
    email: string;
    senha: string;
}

export interface IUpdateUserDTO{
    name?: string;
    cpf?: number;
    email?: string;
    senha?: string;
    active?: boolean;
    papelUsuario?: Papel_usuario;

}