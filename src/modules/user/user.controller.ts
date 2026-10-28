import type { Request, Response } from "express";
import userService from "./user.service.js";
import type { RequestAutenticado } from "../../types/request.types.js";

class UserController {
    public async create(request: Request, response: Response): Promise<Response>{
        const {name, cpf, email, senha, confirmarSenha, dt_nascimento, participacao_anterior, estado_civil, telefone_principal, telefone_secundario, profissao, problemas_saude, aceite_lgpd} = request.body ?? {};

        if(senha !== confirmarSenha) {
            return response.status(400).json({message: "Senhas não coincidem"});
        }

        const user = await userService.create({
            name,
            cpf,
            email,
            senha,
            dt_nascimento,
            participacao_anterior,
            estado_civil,
            telefone_principal,
            telefone_secundario,
            profissao,
            problemas_saude,
            aceite_lgpd
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

    public async updateOwnPhoto(request: RequestAutenticado, response: Response): Promise<Response> {
        const id = request.user?.id;

        if(!id) {
            return response.status(401).json({
                message: "Usuário não autenticado"
            });
        }

        if(!request.file) {
            return response.status(400).json({
                message: "Nenhuma imagem enviada"
            });
        }

        const photo = `/storage/${request.file.filename}`;

        const user = await userService.updateOwnPhoto(id, photo);

        return response.status(200).json({
            message: "Foto Atualizada com sucesso",
            user
        });
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