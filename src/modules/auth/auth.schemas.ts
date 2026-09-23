import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((email) => email.toLowerCase());

const booleanFromForm = z.preprocess(
    (value) => {
        if (typeof value === "string") {
            const normalized = value
                .trim()
                .toLowerCase();

            if (
                normalized === "true" ||
                normalized === "sim" ||
                normalized === "1"
            ) {
                return true;
            }

            if (
                normalized === "false" ||
                normalized === "nao" ||
                normalized === "não" ||
                normalized === "0"
            ) {
                return false;
            }
        }

        return value;
    },
    z.boolean()
);

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, "Nome deve possuir pelo menos 3 caracteres"),

        cpf: z.coerce
            .number()
            .int("CPF inválido")
            .refine(
                (cpf) => cpf.toString().length === 11,
                "CPF deve possuir 11 dígitos"
            ),

        email: emailSchema,

        senha: z
            .string()
            .min(8, "Senha deve possuir pelo menos 8 caracteres"),

        confirmarSenha: z
            .string()
            .min(8, "Confirmação da senha é obrigatória"),

        dt_nascimento: z
            .string()
            .min(1, "Data de nascimento é obrigatória"),

        participacao_anterior: booleanFromForm,

        estado_civil: z
            .string()
            .trim()
            .min(1, "Estado civil é obrigatório"),

        telefone_principal: z
            .string()
            .trim()
            .min(8, "Telefone principal inválido"),

        telefone_secundario: z
            .string()
            .trim()
            .optional(),

        profissao: z
            .string()
            .trim()
            .optional(),

        problemas_saude: z
            .string()
            .trim()
            .optional(),
    })
    .refine(
        (data) => data.senha === data.confirmarSenha,
        {
            message: "As senhas não coincidem",
            path: ["confirmarSenha"],
        }
    )
    .transform(({ confirmarSenha, ...data }) => data);

export type RegisterDTO = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    email: emailSchema,

    senha: z
        .string()
        .min(1, "Senha é obrigatória"),
});

export type LoginDTO = z.infer<typeof loginSchema>;


export const editMeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Nome deve possuir pelo menos 3 caracteres"),

    email: emailSchema,
});

export type EditMeDTO = z.infer<typeof editMeSchema>;


export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export type ForgotPasswordDTO =
    z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        token: z
            .string()
            .min(1, "Token é obrigatório"),

        senha: z
            .string()
            .min(8, "Senha deve possuir pelo menos 8 caracteres"),

        confirmarSenha: z
            .string()
            .min(8, "Confirmação da senha é obrigatória"),
    })
    .refine(
        (data) => data.senha === data.confirmarSenha,
        {
            message: "As senhas não coincidem",
            path: ["confirmarSenha"],
        }
    );

export type ResetPasswordDTO =
    z.infer<typeof resetPasswordSchema>;