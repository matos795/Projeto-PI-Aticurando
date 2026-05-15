import type { Types } from "mongoose";
import type { ICreateMateriaDTO, IUpdateMateriaDTO } from "../materia/materia.types.js";

export interface ICursoMateria {
    materia: Types.ObjectId;
}

export interface ICurso {
    name: string;
    description?: string; 
    active: boolean;
    materias: ICursoMateria[];
    createAt?: string;
    updateAt?: string;
}

export interface ICreateCursoDTO {
    name: string;
    description?: string;
    active?: boolean;
    materias?: ICreateMateriaDTO[];
}

export interface IUpdateCursoDTO {
    name?: string;
    description?: string;
    active?: boolean;
    materias?: ICreateMateriaDTO[];
}