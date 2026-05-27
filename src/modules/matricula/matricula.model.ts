import mongoose, {Schema} from "mongoose";
import {StatusMatricula, type IMatricula} from "./matricula.types.js";

const matriculaSchema = new Schema<IMatricula>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        turma: {
            type: Schema.Types.ObjectId,
            ref: "Turma",
            required: true,
        },
        dataHora: {
            type: Date,
            default: Date.now,
        },
        frequencia:{
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        status:{
            type: String,
            enum: Object.values(StatusMatricula),
            default: StatusMatricula.PENDENTE,
        },
        motivoCancelamento:{
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Matricula = mongoose.model<IMatricula>("Matricula", matriculaSchema)

export default Matricula;