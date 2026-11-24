import type {
    Request,
    Response,
    NextFunction
} from "express";

import certificadoService from "./certificado.service.js";

class CertificadoController {
    public async consultarElegibilidade(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const turmaId = request.params.turmaId;

            if (typeof turmaId !== "string") {
                response.status(400).json({
                    message: "Identificador da turma inválido."
                });
                return;
            }

            const resultado =
                await certificadoService.consultarElegibilidade(
                    turmaId
                );

            response.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
}

export default new CertificadoController();