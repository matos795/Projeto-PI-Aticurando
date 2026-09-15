import "dotenv/config";
import User from "./user.model.js";
import {
    Papel_usuario,
    type IUpdateUserDTO
} from "./user.types.js";
import bcrypt from "bcryptjs";
import type { IRegisterDTO } from "../auth/auth.types.js";

const USER_ADMIN = process.env.USER_ADMIN || ""
const USER_ADMIN_PASSWORD = process.env.USER_ADMIN_PASSWORD

class userService {
    public async create(data: IRegisterDTO) {
        const emailExiste = await User.findOne({ email: data.email });

        if (emailExiste) {
            throw new Error("E-mail já cadastrado, insira um e-mail válido ou faça login")
        }

        const cpfExiste = await User.findOne({ cpf: data.cpf });

        if (cpfExiste) {
            throw new Error("CPF já cadastrado, insira um CPF válido ou faça login")
        }

        const senhaHash = await bcrypt.hash(data.senha, 10)

        const user = await User.create({
            name: data.name,
            cpf: data.cpf,
            email: data.email,
            dt_nascimento: data.dt_nascimento,
            participacao_anterior: data.participacao_anterior,
            estado_civil: data.estado_civil,
            telefone_principal: data.telefone_principal,
            telefone_secundario: data.telefone_secundario,
            profissao: data.profissao,
            problemas_saude: data.problemas_saude,
            senhaHash,
            papelUsuario: Papel_usuario.ALUNO,
            active: true
        })

        return {
            id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            dt_nascimento: user.dt_nascimento,
            participacao_anterior: user.participacao_anterior,
            estado_civil: user.estado_civil,
            telefone_principal: user.telefone_principal,
            telefone_secundario: user.telefone_secundario,
            profissao: user.profissao,
            problemas_saude: user.problemas_saude,
            papel_usuario: user.papelUsuario,
            active: user.active
        };
    }

    public async createAdmin() {

        if (!USER_ADMIN || !USER_ADMIN_PASSWORD) {
            throw new Error(
                "USER_ADMIN e USER_ADMIN_PASSWORD devem estar configurados"
            );
        }

        const emailExiste = await User.findOne({ email: USER_ADMIN });

        if (emailExiste) {
            throw new Error("E-mail já cadastrado, não é possível criar um admin padrão")
        }

        const senhaHash = await bcrypt.hash(USER_ADMIN_PASSWORD, 10)

        const user = await User.create({
            name: "Administrador Aticurando",
            cpf: 12345678912,
            email: USER_ADMIN,
            senhaHash,
            papelUsuario: Papel_usuario.ADM,
            active: true
        })

        return {
            id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            papel_usuario: user.papelUsuario,
            active: user.active
        };
    }

    public async findAll() {
        return await User.find();
    }

    public async findById(id: string) {
        return await User.findById(id);
    }

    public async update(id: string, data: IUpdateUserDTO) {
        return await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
    }

    public async delete(id: string) {
        return await User.findByIdAndDelete(id);
    }
}

export default new userService();