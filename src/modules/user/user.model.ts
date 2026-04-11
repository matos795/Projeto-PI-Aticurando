import mongoose, {Schema} from "mongoose";
import type { IUser } from "./user.types.js";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: false,
        trim: true
    },
    cpf: {
        type: Number,
        required: true
    },
},
{
    timestamps: true,
},
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;