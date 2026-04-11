export interface IUser {
    name: string;
    cpf: number;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateUserDTO{
    name: string;
    cpf: number;
}

export interface IUpdateUserDTO{
    name?: string;
    cpf?: number;
}