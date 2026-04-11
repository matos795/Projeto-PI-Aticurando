
export interface IMateria {
    name: string;
    description?: string;
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
    active?: boolean;
} 