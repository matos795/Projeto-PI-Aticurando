import type {
    Request,
    Response,
    NextFunction
} from "express";

import certificadoService from "./certificado.service.js";

import type {
    RequestAutenticado
} from "../../types/request.types.js";

import { AppError } from "../../errors/app-error.js";

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


    public async emitir(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const matriculaId = request.params.matriculaId;
            const administradorId = request.user?.id;

            if (!administradorId) {
                throw new AppError(
                    "Administrador não autenticado.",
                    401
                );
            }

            if (typeof matriculaId !== "string") {
                throw new AppError(
                    "Identificador da matrícula inválido.",
                    400
                );
            }

            const { certificado, criado } =
                await certificadoService.emitir(
                    matriculaId,
                    administradorId
                );

            response.status(criado ? 201 : 200).json({
                id: certificado._id.toString(),
                codigoVerificacao:
                    certificado.codigoVerificacao,
                nomeAluno: certificado.nomeAluno,
                nomeCurso: certificado.nomeCurso,
                cargaHorariaMinutos:
                    certificado.cargaHorariaMinutos,
                frequenciaPercentual:
                    certificado.frequenciaPercentual,
                emitidoEm: certificado.emitidoEm
            });

        } catch (error) {
            next(error);
        }
    }
}

export default new CertificadoController();