import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import userService from "../user/user.service.js";
import type { ILoginDTO, IRegisterDTO } from "./auth.types.js";


class AuthService {

    public async register(data: IRegisterDTO) {
        return await userService.create(data);
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
            user.get("senhaHash") as string,
        );

        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.papelUsuario,
            },
            process.env.JWT_SECRET as jwt.Secret,
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
}

export default new AuthService();