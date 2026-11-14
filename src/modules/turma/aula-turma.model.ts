import mongoose, { Schema } from "mongoose";
import type { IAulaTurma } from "./turma.types.js";
import { StatusAula } from "./turma.types.js";

const aulaTurmaSchema = new Schema<IAulaTurma>(
    {
        aula: {
            type: Schema.Types.ObjectId,
            ref: "Aula",
            required: true
        },
        turma: {
            type: Schema.Types.ObjectId,
            ref: "Turma",
            required: true
        },
        dataInicio: {
            type: Date,
            required: false
        },
        dataFim: {
            type: Date,
            required: false
        },
        professor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(StatusAula),
            default: StatusAula.PENDENTE
        },
        finalizadaEm: {
            type: Date,
            required: false
        },
        finalizacaoAntecipada: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const AulaTurma = mongoose.model<IAulaTurma>("AulaTurma", aulaTurmaSchema);
export default AulaTurma;