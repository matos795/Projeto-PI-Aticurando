import mongoose, {Schema} from "mongoose";
import type {ICurso} from "./curso.types.js";
import { materiaSchema } from "../materia/materia.model.js";

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
        materias: [
            {
            type: materiaSchema,
            default: true
        }
        ]
    },
    {
        timestamps: true,
    },
);

const Curso = mongoose.model<ICurso>("Curso", cursoSchema)

export default Curso;