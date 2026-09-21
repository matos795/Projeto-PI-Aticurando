import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import userService from "../user/user.service.js";
import type { IEditarAuthUser, ILoginDTO, IRegisterDTO } from "./auth.types.js";

class AuthService {

    public async register(data: IRegisterDTO) {
        return await userService.create(data);
    }

    public async editarMe(data: IEditarAuthUser, id?: string) {
        return await User.findByIdAndUpdate(id, {
            name: data.name,
            email: data.email,
            dt_nascimento: data.dt_nascimento,
            participacao_anterior: data.participacao_anterior,
            estado_civil: data.estado_civil,
            telefone_principal: data.telefone_principal,
            telefone_secundario: data.telefone_secundario,
            profissao: data.profissao,
            problemas_saude: data.problemas_saude
        },
            {
                new: true,
            }
        );
    }

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
            dt_nascimento: user.dt_nascimento,
            participacao_anterior: user.participacao_anterior,
            estado_civil: user.estado_civil,
            telefone_principal: user.telefone_principal,
            telefone_secundario: user.telefone_secundario,
            profissao: user.profissao,
            problemas_saude: user.problemas_saude,
            active: user.active
        };
    }
}

export default new AuthService();