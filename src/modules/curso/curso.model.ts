import mongoose, {Schema} from "mongoose";
import type {ICurso} from "./curso.types.js";

const materiaSchema = new Schema(
    {
        materia: {
            type: Schema.Types.ObjectId,
            ref: "Materia",
            required: true,
        }
    },
    {
        _id: false,
    }
);

const cursoSchema = new Schema<ICurso>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: false,
            trim: true
        },
        active: {
            type: Boolean,
            default: true
        },
        materias: {
            type: [materiaSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

const Curso = mongoose.model<ICurso>("Curso", cursoSchema)

export default Curso;