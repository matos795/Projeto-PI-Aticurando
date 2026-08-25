import Materia from "./materia.model.js";
import type {
    ICreateMateriaDTO,
    IUpdateMateriaDTO
} from "./materia.types.js";

class MateriaService {
    public async create(data: ICreateMateriaDTO){
        const materia = await Materia.create({
            name: data.name,
            description: data.description ?? "",
            active: data.active ?? true,
        })

        return materia;
    }

    public async findAll(){
        return await Materia.find();
    }

    public async findById(id: string){
        return await Materia.findById(id);
    }

    public async update(id: string, data: IUpdateMateriaDTO){
        return await Materia.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
    }

    public async delete(id: string){
        const materia = await Materia.findById(id);

        if (!materia) {
            throw new Error("Matéria não encontrada");
        }

        if (!materia.active) {
            throw new Error("Esta matéria já está desativada");
        }

        materia.active = false;

        return await materia.save();
    }
}

export default new MateriaService();