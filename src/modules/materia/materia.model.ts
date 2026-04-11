import mongoose, {Schema} from "mongoose";
import type { IMateria } from "./materia.types.js";

const materiaSchema = new Schema<IMateria>(
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
        active:{
            type: Boolean,
            default: true
        },
        
    },
    {
        timestamps: true,
    },
);

const Materia = mongoose.model<IMateria>("Materia", materiaSchema);

export default Materia;