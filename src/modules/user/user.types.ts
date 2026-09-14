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
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude: string;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateUserDTO{
    name: string;
    cpf: number;
    email: string;
    senha: string;
    confirmarSenha: string;
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude?: string;
}

export interface IUpdateUserDTO{
    name?: string;
    cpf?: number;
    email?: string;
    senha?: string;
    active?: boolean;
    papelUsuario?: Papel_usuario;
     dt_nascimento?: string;
    participacao_anterior?: boolean;
    estado_civil?: string;
    telefone_principal?: string;
    telefone_secundario?: string;
    profissao?: string;
    problemas_saude?: string;

}