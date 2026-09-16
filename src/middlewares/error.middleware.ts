import type {
    NextFunction,
    Request,
    Response
} from "express";

import { AppError } from "../errors/app-error.js";

export function errorMiddleware(
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({
        message: "Erro interno do servidor"
    });
}