import Aula from "./aula.model.js";
import type { ICreateAulaDTO, IUpdateAulaDTO } from "./aula.types.js";
import Materia from "../materia/materia.model.js";

class AulaService{
    public async create(data: ICreateAulaDTO){
        const materiaExists = await Materia.findById(data.materiaId);
        if (!materiaExists) {
            throw new Error("Materia não encontrada");
        }

        const aula = await Aula.create({
            titulo: data.titulo,
            descricao: data.descricao,
            duracao: data.duracao,
            materiaId: data.materiaId,
            ordem: data.ordem
        });

        return aula;
    }

    public async findAll(){
        return await Aula.find();
    }

    public async findById(id: string){
        return await Aula.findById(id);
    }
    
    public async findAllByMateria(materiaId: string){
        return await Aula.find({ materiaId: materiaId })
    }

    public async update(id: string, data: IUpdateAulaDTO){
        return await Aula.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
    }

    public async delete(id: string){
        const aula = await Aula.findById(id);
        if (!aula) {
            throw new Error("Aula not found");
        }
        aula.active = false;

        return await aula.save();
    }
    }

export default new AulaService();