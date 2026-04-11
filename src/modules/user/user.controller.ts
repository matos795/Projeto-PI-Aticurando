import type { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
    public async create(request: Request, response: Response): Promise<Response>{
        const {name, cpf} = request.body ?? {};

        const user = await userService.create({
            name,
            cpf
        });

        return response.status(201).json(user);
    }

    public async findAll(request: Request, response: Response): Promise<Response>{
        const users = await userService.findAll();

        return response.status(200).json(users);
    }

    public async update(request: Request, response: Response): Promise<Response>{
        const {id} = request.params;
        const {name, cpf} = request.body;

        if(!id || typeof id !== "string"){
            return response.status(400).json({
                message: "Id Inválido"
            });
        }

        const user = await userService.update(id, {
            name,
            cpf
        });

        return response.status(200).json(user);
    }

    public async findById(request: Request, response: Response): Promise<Response>{
        const {id} = request.params;

        if(!id || typeof id !== "string"){
            return response.status(400).json({
                message: "Id Inválido"
            });
        }

        const user = await userService.findById(id);

        return response.status(200).json(user);
    }

    public async delete(request: Request, response: Response){
        const {id} = request.params;

        if(!id || typeof id !== "string"){
            return response.status(400).json({
                message: "Id Inválido"
            });
        }

        await userService.delete(id);

        return response.status(200).json({
            message: "Usuário deletado com sucesso",
        })
    }
}

export default new UserController()