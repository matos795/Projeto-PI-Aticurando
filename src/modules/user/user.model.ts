import mongoose, {Schema} from "mongoose";
import { Papel_usuario, type IUser } from "./user.types.js";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: false,
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
    senha: {
        type: String,
        required: true,
        select: false
    },
    papelUsuario: {
        type: String,
        enum: Object.values(Papel_usuario),
        default: Papel_usuario.ALUNO,
        required: true
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