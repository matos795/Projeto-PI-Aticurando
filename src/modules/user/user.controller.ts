import type { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
    public async create(request: Request, response: Response): Promise<Response>{
        const {
            name, 
            cpf, 
            email, 
            senha, 
            confirmarSenha, 
            dt_nascimento, 
            participacao_anterior, 
            estado_civil, 
            telefone_principal, 
            telefone_secundario, 
            profissao, 
            problemas_saude,
            aceite_lgpd
        } = request.body ?? {};

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

    public async createProfessor(request: Request, response: Response): Promise<Response>{
        const {
            name,
            cpf,
            email,
            senha,
            confirmarSenha,
            dt_nascimento,
            estado_civil,
            telefone_principal,
            telefone_secundario,
            aceite_lgpd
        } = request.body ?? {};

        if (senha !== confirmarSenha) {
            return response.status(400).json({ message: "Senhas não coincidem" });
        }

        const professor = await userService.createProfessor({
            name,
            cpf,
            email,
            senha,
            confirmarSenha,
            dt_nascimento,
            estado_civil,
            telefone_principal,
            telefone_secundario,
            aceite_lgpd
        });

        return response.status(201).json(professor);
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

    public async updateProfessor(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const {
            name,
            cpf,
            email,
            senha,
            dt_nascimento,
            estado_civil,
            telefone_principal,
            telefone_secundario,
            active
        } = request.body ?? {};

        if (!id || typeof id !== "string") {
            return response.status(400).json({ message: "Id Inválido" });
        }

        const professor = await userService.updateProfessor(id, {
            name,
            cpf,
            email,
            senha,
            dt_nascimento,
            estado_civil,
            telefone_principal,
            telefone_secundario,
            active
        });

        return response.status(200).json(professor);
    }

    public async findAllProfessores(request: Request, response: Response): Promise<Response> {
        const professores = await userService.findAllProfessores();
        return response.status(200).json(professores);
    }

    public async inactivateProfessor(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        if (!id || typeof id !== "string") {
            return response.status(400).json({ message: "Id Inválido" });
        }

        const professor = await userService.inactivateProfessor(id);

        return response.status(200).json({
            message: "Professor inativado com sucesso",
            professor
        });
    }
}

export default new UserController()