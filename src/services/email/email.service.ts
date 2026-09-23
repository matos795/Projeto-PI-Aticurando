import { BrevoClient } from "@getbrevo/brevo";
import { AppError } from "../../errors/app-error.js";

class EmailService {
    private getClient(): BrevoClient {
        const apiKey = process.env.BREVO_API_KEY;

        if (!apiKey) {
            throw new AppError(
                "Serviço de e-mail não configurado",
                500
            );
        }

        return new BrevoClient({
            apiKey,
        });
    }

    public async sendPasswordReset(
        email: string,
        resetUrl: string
    ): Promise<void> {
        const senderEmail = process.env.BREVO_SENDER_EMAIL;
        const senderName =
            process.env.BREVO_SENDER_NAME ?? "Aticurando";

        if (!senderEmail) {
            throw new AppError(
                "Remetente de e-mail não configurado",
                500
            );
        }

        const client = this.getClient();

        await client.transactionalEmails.sendTransacEmail({
            sender: {
                email: senderEmail,
                name: senderName,
            },

            to: [
                {
                    email,
                },
            ],

            subject: "Redefinição de senha - Aticurando",

            htmlContent: `
                <html>
                    <body>
                        <h2>Redefinição de senha</h2>

                        <p>
                            Recebemos uma solicitação para redefinir
                            a senha da sua conta.
                        </p>

                        <p>
                            <a href="${resetUrl}">
                                Redefinir minha senha
                            </a>
                        </p>

                        <p>
                            Este link possui tempo limitado de validade.
                        </p>

                        <p>
                            Se você não solicitou esta alteração,
                            ignore este e-mail.
                        </p>
                    </body>
                </html>
            `,
        });
    }
}

export default new EmailService();