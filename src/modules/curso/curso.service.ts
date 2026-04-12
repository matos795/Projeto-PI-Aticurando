import Curso from "./curso.model.js";
import type { ICreateCursoDTO, IUpdateCursoDTO } from "./curso.types.js";

class CursoService {
    public async create(data: ICreateCursoDTO) {
        const curso = await Curso.create({
            name: data.name,
            description: data.description ?? "",
            active: data.active ?? true,
        });

        return curso;
    }

    public async findAll() {
        return await Curso.find();
    }

    public async findById(id: string) {
        return await Curso.findById(id);
    }

    public async update(id: string, data: IUpdateCursoDTO) {
        return await Curso.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    public async delete(id: string) {
        return await Curso.findByIdAndDelete(id);
    }
}

export default new CursoService();