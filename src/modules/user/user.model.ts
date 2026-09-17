import mongoose, { Schema } from "mongoose";
import { Papel_usuario, type IUser } from "./user.types.js";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cpf: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    senhaHash: {
        type: String,
        required: true,
        select: false,
    },
    papelUsuario: {
        type: String,
        enum: Object.values(Papel_usuario),
        default: Papel_usuario.ALUNO,
        required: true
    },
    dt_nascimento: {
        type: String,
        required: false,
        trim: true
    },
    participacao_anterior: {
        type: Boolean,
        required: false
    },
    estado_civil: {
        type: String,
        required: false,
        trim: true
    },
    telefone_principal: {
        type: String,
        required: false,
        trim: true
    },
    telefone_secundario: {
        type: String,
        required: false,
        trim: true
    },
    profissao: {
        type: String,
        required: false,
        trim: true
    },
    problemas_saude: {
        type: String,
        required: false
    },
    passwordResetTokenHash: {
        type: String,
        required: false,
        select: false,
    },
    passwordResetExpiresAt: {
        type: Date,
        required: false,
        select: false,
    },
    active: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
    },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;