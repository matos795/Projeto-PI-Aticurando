import mongoose, {Schema} from "mongoose";
import type {ITurma} from "./turma.types.js";

const turmaSchema = new Schema<ITurma>(
{
        capacidade: {
            type: Number,
            required: true,
            default: 35,
            min: 1,
        },
        turno: {
            type: String,
            required: true,
            enum: ["MANHA", "TARDE", "NOITE"],
        },
        data_inicio: {
            type: Date,
            required: true,
        },
        data_fim: {
            type: Date,
            require: true
        },
        curso: {
            type: Schema.Types.ObjectId,
            ref: "Curso",
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Turma = mongoose.model<ITurma>("Turma", turmaSchema);

export default Turma;