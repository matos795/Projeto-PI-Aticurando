
import mongoose, { Schema } from "mongoose";

import type { ICertificado } from "./certificado.types.js";

const certificadoSchema = new Schema<ICertificado>(
    {
        matricula: {
            type: Schema.Types.ObjectId,
            ref: "Matricula",
            required: true,
            unique: true,
            immutable: true
        },

        aluno: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            immutable: true
        },

        turma: {
            type: Schema.Types.ObjectId,
            ref: "Turma",
            required: true,
            immutable: true
        },

        curso: {
            type: Schema.Types.ObjectId,
            ref: "Curso",
            required: true,
            immutable: true
        },

        codigoVerificacao: {
            type: String,
            required: true,
            unique: true,
            immutable: true
        },

        nomeAluno: {
            type: String,
            required: true,
            trim: true,
            immutable: true
        },

        nomeCurso: {
            type: String,
            required: true,
            trim: true,
            immutable: true
        },

        turno: {
            type: String,
            required: true,
            immutable: true
        },

        periodoInicio: {
            type: Date,
            required: true,
            immutable: true
        },

        periodoFim: {
            type: Date,
            required: true,
            immutable: true
        },

        cargaHorariaMinutos: {
            type: Number,
            required: true,
            min: 1,
            immutable: true
        },

        frequenciaPercentual: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            immutable: true
        },

        presentes: {
            type: Number,
            required: true,
            min: 0,
            immutable: true
        },

        faltas: {
            type: Number,
            required: true,
            min: 0,
            immutable: true
        },

        aulasRealizadas: {
            type: Number,
            required: true,
            min: 1,
            immutable: true
        },

        emitidoPor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            immutable: true
        },

        emitidoEm: {
            type: Date,
            default: Date.now,
            required: true,
            immutable: true
        }
    },
    {
        timestamps: true
    }
);

const Certificado = mongoose.model<ICertificado>(
    "Certificado",
    certificadoSchema
);

export default Certificado;