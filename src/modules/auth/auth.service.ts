import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { HydratedDocument } from "mongoose";
import User from "../user/user.model.js";
import type { IUser } from "../user/user.types.js";
import userService from "../user/user.service.js";
import emailService from "../../services/email/email.service.js";
import { AppError } from "../../errors/app-error.js";
import type {
    EditMeDTO,
    ForgotPasswordDTO,
    LoginDTO,
    RegisterDTO,
    ResetPasswordDTO
} from "./auth.schemas.js";

class AuthService {

    private toProfile(user: HydratedDocument<IUser>) {
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

    public async register(data: RegisterDTO, caminhoFoto?: string) {
        return userService.create(data, caminhoFoto);
    }

    public async editarMe(
        data: EditMeDTO,
        id?: string
    ) {
        if (!id) {
            throw new AppError("Usuário não autenticado", 401);
        }

        const dadosPermitidos = {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.dt_nascimento !== undefined
                ? { dt_nascimento: data.dt_nascimento }
                : {}),
            ...(data.participacao_anterior !== undefined
                ? { participacao_anterior: data.participacao_anterior }
                : {}),
            ...(data.estado_civil !== undefined
                ? { estado_civil: data.estado_civil }
                : {}),
            ...(data.telefone_principal !== undefined
                ? { telefone_principal: data.telefone_principal }
                : {}),
            ...(data.telefone_secundario !== undefined
                ? { telefone_secundario: data.telefone_secundario }
                : {}),
            ...(data.profissao !== undefined
                ? { profissao: data.profissao }
                : {}),
            ...(data.problemas_saude !== undefined
                ? { problemas_saude: data.problemas_saude }
                : {}),
        };

        const user = await User.findByIdAndUpdate(
            id,
            dadosPermitidos,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return this.toProfile(user);
    }

    public async login(data: LoginDTO) {
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

        return this.toProfile(user);
    }

    public async forgotPassword(data: ForgotPasswordDTO): Promise<void> {
        const user = await User.findOne({
            email: data.email.toLowerCase(),
        });

        if (!user) {
            return;
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expiresMinutes = Number(
            process.env.PASSWORD_RESET_EXPIRES_MINUTES ?? 30
        );

        user.passwordResetTokenHash = resetTokenHash;

        user.passwordResetExpiresAt = new Date(
            Date.now() + expiresMinutes * 60 * 1000
        );

        await user.save();

        const frontendUrl =
            process.env.FRONTEND_URL ?? "http://localhost:5173";

        const resetUrl =
            `${frontendUrl}/reset-password?token=${resetToken}`;

        await emailService.sendPasswordReset(
            user.email,
            resetUrl
        );
    }

    public async resetPassword(
        data: ResetPasswordDTO
    ): Promise<void> {
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(data.token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetTokenHash: resetTokenHash,

            passwordResetExpiresAt: {
                $gt: new Date(),
            },
        });

        if (!user) {
            throw new AppError(
                "Token inválido ou expirado",
                400
            );
        }

        const senhaHash = await bcrypt.hash(
            data.senha,
            10
        );

        await User.updateOne(
            {
                _id: user._id,
            },
            {
                $set: {
                    senhaHash,
                },

                $unset: {
                    passwordResetTokenHash: 1,
                    passwordResetExpiresAt: 1,
                },
            }
        );
    }
}

export default new AuthService();