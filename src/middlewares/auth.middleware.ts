import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { RequestAutenticado } from "../types/request.types.js";
import type { Papel_usuario } from "../modules/user/user.types.js";

interface IToken {
    id: string;
    papelUsuario: Papel_usuario;
}

export function requireAuth(
    request: RequestAutenticado,
    response: Response,
    next: NextFunction,
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({
            message: "Token não informado",
        });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return response.status(401).json({
            message: "Token inválido",
        });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return response.status(500).json({
            message: "JWT_SECRET não configurado",
        });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as IToken;

        request.user = {
            id: decoded.id,
            papelUsuario: decoded.papelUsuario,
        };

        return next();
    } catch {
        return response.status(401).json({
            message: "Token inválido ou expirado",
        });
    }
}

export function authorizeRoles(...roles: Papel_usuario[]) {
    return (
        request: RequestAutenticado,
        response: Response,
        next: NextFunction,
    ) => {
        if (!request.user) {
            return response.status(401).json({
                message: "Usuário não autenticado",
            });
        }

        if (!roles.includes(request.user.papelUsuario)) {
            return response.status(403).json({
                message: "Você não tem permissão para acessar este recurso",
            });
        }

        return next();
    };
}