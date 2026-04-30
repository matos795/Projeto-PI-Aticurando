import type { IMateria } from "../materia/materia.types.js";

export interface ICurso {
    name: string;
    description?: string; 
    active: boolean;
    createAt?: string;
    updateAt?: string;
    materias?: IMateria[];
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