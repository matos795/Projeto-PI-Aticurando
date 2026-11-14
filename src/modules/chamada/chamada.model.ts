import mongoose, { Schema } from "mongoose";
import type { IChamada } from "./chamada.types.js";
import { StatusPresenca } from "./chamada.types.js";

const registroPresencaSchema = new Schema(
    {
        matricula: {
            type: Schema.Types.ObjectId,
            ref: "Matricula",
            required: true
        },
        status: {
            type: String,
            enum: Object.values(StatusPresenca),
            required: true
        }
    },
    {
        _id: false
    }
);

const chamadaSchema = new Schema<IChamada>(
    {
        aulaTurma: {
            type: Schema.Types.ObjectId,
            ref: "AulaTurma",
            required: true,
            unique: true
        },
        professor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        registros: {
            type: [registroPresencaSchema],
            default: []
        },
        observacao: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Chamada = mongoose.model<IChamada>(
    "Chamada",
    chamadaSchema
);

export default Chamada;