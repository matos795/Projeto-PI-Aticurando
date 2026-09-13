export interface IRegisterDTO {
    name: string;
    cpf: number;
    email: string;
    senha: string;
    dt_nascimento: string;
    participacao_anterior: boolean;
    estado_civil: string;
    telefone_principal: string;
    telefone_secundario: string;
    profissao: string;
    problemas_saude: string;
    
}

export interface ILoginDTO {
    email: string;
    senha: string;
}

export interface IEditarAuthUser {
    name: string;
    email: string;
}