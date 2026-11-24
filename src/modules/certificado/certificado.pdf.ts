import PDFDocument from "pdfkit";

import type {
    ICertificado
} from "./certificado.types.js";

type DadosPdf = Pick<
    ICertificado,
    | "nomeAluno"
    | "nomeCurso"
    | "turno"
    | "periodoInicio"
    | "periodoFim"
    | "cargaHorariaMinutos"
    | "frequenciaPercentual"
    | "codigoVerificacao"
    | "emitidoEm"
>;

function formatarData(data: Date): string {
    return new Date(data).toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });
}

function formatarHoras(minutos: number): string {
    return (minutos / 60).toLocaleString("pt-BR", {
        maximumFractionDigits: 2
    });
}

export function gerarCertificadoPdf(
    certificado: DadosPdf
): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 0,
            info: {
                Title: `Certificado - ${certificado.nomeAluno}`,
                Author: "Aticurando",
                Subject: "Certificado de conclusão de curso"
            }
        });

        const partes: Buffer[] = [];

        doc.on("data", (parte: Buffer) => {
            partes.push(Buffer.from(parte));
        });

        doc.on("end", () => {
            resolve(Buffer.concat(partes));
        });

        doc.on("error", reject);

        try {
            const largura = doc.page.width;
            const altura = doc.page.height;

            const azulEscuro = "#0F172A";
            const azul = "#2563EB";
            const cinza = "#475569";

            doc.rect(0, 0, largura, altura)
                .fill("#F8FAFC");

            doc.rect(0, 0, largura, 110)
                .fill(azulEscuro);

            doc.rect(0, 110, largura, 7)
                .fill(azul);

            doc.font("Helvetica-Bold")
                .fontSize(24)
                .fillColor("#FFFFFF")
                .text("ATICURANDO", 60, 31, {
                    width: largura - 120,
                    align: "center"
                });

            doc.font("Helvetica")
                .fontSize(11)
                .fillColor("#BFDBFE")
                .text(
                    "Educação, conhecimento e transformação",
                    60,
                    72,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            doc.lineWidth(1.5)
                .strokeColor("#CBD5E1")
                .rect(
                    28,
                    133,
                    largura - 56,
                    altura - 155
                )
                .stroke();

            doc.font("Helvetica-Bold")
                .fontSize(22)
                .fillColor(azulEscuro)
                .text(
                    "CERTIFICADO DE CONCLUSÃO",
                    60,
                    157,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            doc.font("Helvetica")
                .fontSize(13)
                .fillColor(cinza)
                .text(
                    "Certificamos que",
                    60,
                    199,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            let tamanhoNome = 29;

            if (certificado.nomeAluno.length > 42) {
                tamanhoNome = 19;
            } else if (certificado.nomeAluno.length > 30) {
                tamanhoNome = 23;
            }

            doc.font("Helvetica-Bold")
                .fontSize(tamanhoNome)
                .fillColor(azul)
                .text(
                    certificado.nomeAluno,
                    65,
                    224,
                    {
                        width: largura - 130,
                        height: 43,
                        align: "center",
                        ellipsis: true
                    }
                );

            doc.font("Helvetica")
                .fontSize(13)
                .fillColor(cinza)
                .text(
                    "concluiu o curso",
                    60,
                    275,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            const tamanhoCurso =
                certificado.nomeCurso.length > 50
                    ? 16
                    : 21;

            doc.font("Helvetica-Bold")
                .fontSize(tamanhoCurso)
                .fillColor(azulEscuro)
                .text(
                    certificado.nomeCurso,
                    65,
                    303,
                    {
                        width: largura - 130,
                        height: 47,
                        align: "center",
                        ellipsis: true
                    }
                );

            doc.font("Helvetica")
                .fontSize(11)
                .fillColor(cinza)
                .text(
                    `Período da turma: ${formatarData(certificado.periodoInicio)} a ${formatarData(certificado.periodoFim)}`,
                    60,
                    363,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            const cargaHoraria =
                `${formatarHoras(certificado.cargaHorariaMinutos)} horas`;

            const frequencia =
                `${certificado.frequenciaPercentual.toLocaleString("pt-BR")}%`;

            doc.roundedRect(
                105,
                395,
                largura - 210,
                60,
                10
            ).fill("#DBEAFE");

            doc.font("Helvetica-Bold")
                .fontSize(12)
                .fillColor(azulEscuro)
                .text(
                    `Carga horária: ${cargaHoraria}`,
                    120,
                    407,
                    {
                        width: (largura - 240) / 2,
                        align: "center"
                    }
                );

            doc.text(
                `Frequência: ${frequencia}`,
                largura / 2,
                407,
                {
                    width: (largura - 240) / 2,
                    align: "center"
                }
            );

            doc.font("Helvetica")
                .fontSize(10)
                .fillColor(cinza)
                .text(
                    `Emitido em ${formatarData(certificado.emitidoEm)}`,
                    60,
                    442,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            doc.font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(azulEscuro)
                .text(
                    `Código de verificação: ${certificado.codigoVerificacao}`,
                    60,
                    484,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            const enderecoBase =
                process.env.FRONTEND_URL ??
                "http://localhost:5173";

            const urlValidacao = new URL(
                `/validar-certificado/${certificado.codigoVerificacao}`,
                enderecoBase
            ).toString();

            doc.font("Helvetica")
                .fontSize(9)
                .fillColor(azul)
                .text(
                    urlValidacao,
                    60,
                    507,
                    {
                        width: largura - 120,
                        align: "center",
                        link: urlValidacao,
                        underline: true
                    }
                );

            doc.font("Helvetica")
                .fontSize(9)
                .fillColor(cinza)
                .text(
                    "Documento eletrônico emitido pelo Aticurando.",
                    60,
                    551,
                    {
                        width: largura - 120,
                        align: "center"
                    }
                );

            doc.end();

        } catch (error) {
            doc.destroy();
            reject(error);
        }
    });
}
