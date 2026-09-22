import { z } from "zod";

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

    email: z
        .string()
        .trim()
        .email("E-mail inválido"),

    senha: z
        .string()
        .min(8, "Senha deve possuir pelo menos 8 caracteres"),

    dt_nascimento: z
        .string()
        .min(1, "Data de nascimento é obrigatória")
        .refine(
            (data) => !Number.isNaN(Date.parse(data)),
            "Data de nascimento inválida"
        ),

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
        .trim(),

    profissao: z
        .string()
        .trim(),

    problemas_saude: z
        .string()
        .trim(),
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("E-mail inválido"),

    senha: z
        .string()
        .min(1, "Senha é obrigatória"),
});