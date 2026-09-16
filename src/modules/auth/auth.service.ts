import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import userService from "../user/user.service.js";
import type { IEditarAuthUser, ILoginDTO, IRegisterDTO } from "./auth.types.js";
import { AppError } from "../../errors/app-error.js";

class AuthService {

    public async register(data: IRegisterDTO) {
        return await userService.create(data);
    }

    public async editarMe(data: IEditarAuthUser, id?: string) {
        return await User.findByIdAndUpdate(id, {
            name: data.name,
            email: data.email,
        },
            {
                new: true,
            }
        );
    }

    public async login(data: ILoginDTO) {
        const user = await User.findOne({ email: data.email }).select("+senhaHash");

        if (!user) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        if (!user.active) {
            throw new AppError("Usuário inativo", 403);
        }

        const senhaValida = await bcrypt.compare(
            data.senha,
            user.senhaHash,
        );

        if (!senhaValida) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new AppError("JWT_SECRET não configurado no servidor", 500);
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
            throw new AppError("Usuário não encontrado", 404);
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