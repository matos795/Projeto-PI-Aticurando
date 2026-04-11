import type { Request, Response} from "express";
import materiaService from "./materia.service.js";


class MateriaController {
    public async create(request: Request, response: Response) : Promise<Response>{
        const {name, description, active} = request.body ?? {};

        const materia = await materiaService.create({
            name,
            description,
            active
        });

        return response.status(201).json(materia);
    }

    public async findAll(request: Request, response: Response) : Promise<Response>{
        const materias = await materiaService.findAll();

        return response.status(200).json(materias);
    }

    public async update(request: Request, response: Response) : Promise<Response>{
        const {id} = request.params;
        const {name, description, active} = request.body;

        if(!id || typeof id !== "string" ){
            return response.status(400).json({
                message: "ID INVÁLIDO!"
            });
        }

        const materia = await materiaService.update(id, {
            name,
            description,
            active
        });

        return response.status(200).json(materia);
    }

    public async findById(request: Request, response: Response): Promise<Response>{
        const {id} = request.params;

        if(!id || typeof id !== "string" ){
            return response.status(400).json({
                message: "ID INVÁLIDO!"
            });
        }

        const materia = await materiaService.findById(id);

        return response.status(200).json(materia);

    }

    public async delete(request: Request, response: Response){

        const {id} = request.params;

        if(!id || typeof id !== "string"){
            return response.status(400).json({
                message: "Id inválido",
            })
        }

        await materiaService.delete(id);

        return response.status(200).json({
            message: "Materia deletada com sucesso",
        })
    };
}

export default new MateriaController()