export interface ICurso {
    name: string;
    description?: string; 
    active: boolean;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateCursoDTO{
    name: string;
    description?: string;
    active?: boolean;
}

export interface IUpdateCursoDTO{
    name?: string;
    description?: string;
    active?: boolean;
}