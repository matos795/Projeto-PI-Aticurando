import Materia from "../materia/materia.model.js";
import Curso from "./curso.model.js";
import type { ICreateCursoDTO, IUpdateCursoDTO } from "./curso.types.js";

class CursoService {

    public async create(data: ICreateCursoDTO) {

        const materiasCriadas = await Promise.all(
            (data.materias ?? []).map(async (materia) => {
                const novaMateria = await Materia.create({
                    name: materia.name,
                    description: materia.description ?? "",
                    active: materia.active ?? true,
                });

                return {
                    materia: novaMateria._id,
                };
            })
        );

        const curso = await Curso.create({
            name: data.name,
            description: data.description ?? "",
            active: data.active ?? true,
            materias: materiasCriadas,
        });

        return await curso.populate("materias.materia");
    }

    public async findAll() {
        return await Curso.find().populate("materias.materia");
    }

    public async findById(id: string) {
        return await Curso.findById(id).populate("materias.materia");
    }

    public async update(id: string, data: IUpdateCursoDTO) {
        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.description !== undefined) {
            updateData.description = data.description;
        }

        if (data.active !== undefined) {
            updateData.active = data.active;
        }

        if (data.materias !== undefined) {
            const materiasCriadas = await Promise.all(
                data.materias.map(async (materia) => {
                    const novaMateria = await Materia.create({
                        name: materia.name,
                        description: materia.description ?? "",
                        active: materia.active ?? true,
                    });

                    return {
                        materia: novaMateria._id,
                    };
                })
            );

            updateData.materias = materiasCriadas;
        }

        return await Curso.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("materias.materia");
    }

    public async delete(id: string) {
        return await Curso.findByIdAndDelete(id);
    }
}

export default new CursoService();