import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import userService from "../user/user.service.js";
import type { ILoginDTO, IRegisterCursoDTO, IRegisterDTO, IRegisterTurmaDTO } from "./auth.types.js";
import cursoService from "../curso/curso.service.js";
import turmaService from "../turma/turma.service.js";

class AuthService {

    public async register(data: IRegisterDTO) {
        return await userService.create(data);
    }

    public async registerCurso(data: IRegisterCursoDTO) {
        return await cursoService.create(data);
    }

   /*  public async registerTurma(data: IRegisterTurmaDTO) {
        return await turmaService.create(data);
    } */

    public async login(data: ILoginDTO) {
        const user = await User.findOne({ email: data.email }).select("+senhaHash");

        if (!user) {
            throw new Error("E-mail ou senha inválidos");
        }

        if (!user.active) {
            throw new Error("Usuário inativo");
        }

        const senhaValida = await bcrypt.compare(
            data.senha,
            user.senhaHash,
        );

        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET não configurado no .env");
        }

        const token = jwt.sign(
            {
                id: user._id,
                papelUsuario: user.papelUsuario,
            },
            jwtSecret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
            } as jwt.SignOptions,
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                cpf: user.cpf,
                email: user.email,
                papelUsuario: user.papelUsuario,
            },
        };
    }

    public async getMe(userId: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return {
            id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            papelUsuario: user.papelUsuario,
            active: user.active
        };
    }   
}

export default new AuthService();