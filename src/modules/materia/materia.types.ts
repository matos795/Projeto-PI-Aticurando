import type { IAula } from "../aula/aula.types.js";

export interface IMateria {
    name: string;
    description?: string;
   //aulas?: IAula[];
    active: boolean;
    createAt?: string;
    updateAt?: string;
}

export interface ICreateMateriaDTO{
    name: string;
    description?: string;
    active?: boolean;
} 

export interface IUpdateMateriaDTO{
    name?: string;
    description?: string;
    aulas?: IAula[];
    active?: boolean;
} 