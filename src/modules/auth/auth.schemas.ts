import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("E-mail inválido")
    .transform((email) => email.toLowerCase());

export const registerSchema = z.object({
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

    dt_nascimento: z
        .string()
        .min(1, "Data de nascimento é obrigatória"),

    participacao_anterior: z.boolean(),

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
});

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