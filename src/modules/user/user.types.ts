import type {Types} from "mongoose"

export enum Papel_usuario {
    ADM = "ADM",
    ALUNO = "ALUNO",
    PROFESSOR = "PROFESSOR"}

export interface IUser {
    name: string;
    cpf: number;
    email: string;
    senhaHash: string;
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
    confirmarSenha: string;
}

export interface IUpdateUserDTO{
    name?: string;
    cpf?: number;
    email?: string;
    senha?: string;
    active?: boolean;
    papelUsuario?: Papel_usuario;

}