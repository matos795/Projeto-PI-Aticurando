import { create } from "node:domain";
import Curso from "./curso.model.js";
import type {ICreateCursoDTO} from "./curso.types.js"
import { deflate } from "node:zlib";

class CursoService{
    public async create(data: ICreateCursoDTO){
        const curso = await Curso.create({
            name: data.name,
            description: data.description ?? "",
            active: data.active ?? true,
        })

        return curso;
    }
}

export default new CursoService();