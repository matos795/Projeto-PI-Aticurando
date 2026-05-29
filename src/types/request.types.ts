import type { Request } from "express";
import type { Papel_usuario } from "../modules/user/user.types.js";

export interface RequestAutenticado extends Request {
    user: {
        id: string;
        papelUsuario: Papel_usuario;
    };
}