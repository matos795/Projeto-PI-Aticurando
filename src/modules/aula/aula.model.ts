import mongoose, { Schema, Document } from 'mongoose';
import type { IAula } from '../aula/aula.types.js';

const aulaSchema = new Schema<IAula>(
    {
        titulo: {
            type: String,
            required: true,
            trim: true
        },
        descricao: {
            type: String,
            required: true,
            trim: true
        },
        duracao: {
            type: Number,
            required: true
        },
        materiaId: {
            type: Schema.Types.ObjectId,
            ref: "Materia",
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        ordem: {
            type: Number,
            required: true
        }

    },
    {
        timestamps: true,
    },
);

const Aula = mongoose.model<IAula>("Aula", aulaSchema);

export default Aula;