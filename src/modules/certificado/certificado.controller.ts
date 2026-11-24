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
import { gerarCertificadoPdf } from "./certificado.pdf.js";

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


    public async listarEmitidosDaTurma(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const turmaId = request.params.turmaId;

            if (typeof turmaId !== "string") {
                throw new AppError("Turma inválida.", 400);
            }

            const certificados =
                await certificadoService.listarEmitidosDaTurma(
                    turmaId
                );

            response.status(200).json(certificados);
        } catch (error) {
            next(error);
        }
    }

    public async listarMeus(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const alunoId = request.user?.id;

            if (!alunoId) {
                throw new AppError(
                    "Aluno não autenticado.",
                    401
                );
            }

            const certificados =
                await certificadoService.listarMeus(alunoId);

            response.status(200).json(certificados);
        } catch (error) {
            next(error);
        }
    }

    public async baixarPdf(
        request: RequestAutenticado,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const certificadoId = request.params.id;
            const usuario = request.user;

            if (
                typeof certificadoId !== "string" ||
                !usuario
            ) {
                throw new AppError(
                    "Requisição não autorizada ou inválida.",
                    401
                );
            }

            const certificado =
                await certificadoService.obterParaDownload(
                    certificadoId,
                    usuario.id,
                    usuario.papelUsuario
                );

            const pdf = await gerarCertificadoPdf(certificado);

            response.setHeader(
                "Content-Type",
                "application/pdf"
            );

            response.setHeader(
                "Content-Disposition",
                `attachment; filename="certificado-${certificado.codigoVerificacao}.pdf"`
            );

            response.setHeader(
                "Cache-Control",
                "private, no-store"
            );

            response.status(200).send(pdf);

        } catch (error) {
            next(error);
        }
    }

    public async validarAutenticidade(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const codigo = request.params.codigo;

            if (typeof codigo !== "string") {
                throw new AppError(
                    "Código inválido.",
                    400
                );
            }

            const resultado =
                await certificadoService.validarAutenticidade(
                    codigo
                );

            response.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
}

export default new CertificadoController();