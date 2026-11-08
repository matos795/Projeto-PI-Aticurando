import "dotenv/config";
import User from "./user.model.js";
import {
    Papel_usuario,
    type ICreateProfessorDTO,
    type IUpdateProfessorDTO,
    type IUpdateUserDTO
} from "./user.types.js";
import bcrypt from "bcryptjs";
import type { RegisterDTO } from "../auth/auth.schemas.js";
import { AppError } from "../../errors/app-error.js";

const USER_ADMIN = process.env.USER_ADMIN || ""
const USER_ADMIN_PASSWORD = process.env.USER_ADMIN_PASSWORD

class userService {
    public async create(data: RegisterDTO, caminhoFoto?: string) {
        const emailExiste = await User.findOne({
            email: data.email
        });

        if (emailExiste) {
            throw new AppError(
                "E-mail já cadastrado, insira outro e-mail ou faça login",
                409
            );
        }

        const cpfExiste = await User.findOne({
            cpf: data.cpf
        });

        if (cpfExiste) {
            throw new AppError(
                "CPF já cadastrado",
                409
            );
        }

        const senhaHash = await bcrypt.hash(
            data.senha,
            10
        );

        const user = await User.create({
            name: data.name,
            cpf: data.cpf,
            email: data.email,
            dt_nascimento: data.dt_nascimento,
            participacao_anterior: data.participacao_anterior,
            estado_civil: data.estado_civil,
            telefone_principal: data.telefone_principal,
            aceite_lgpd: data.aceite_lgpd,
            ...(data.telefone_secundario !== undefined && {
                telefone_secundario: data.telefone_secundario,
            }),
            ...(data.profissao !== undefined && {
                profissao: data.profissao,
            }),
            ...(data.problemas_saude !== undefined && {
                problemas_saude: data.problemas_saude,
            }),
            senhaHash,
            papelUsuario: Papel_usuario.ALUNO,
            active: true,
            photo: caminhoFoto ?? null,
        });

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
            aceite_lgpd: user.aceite_lgpd,
            papelUsuario: user.papelUsuario,
            active: user.active,
            photo: user.photo,
        };
    }

    public async createAdmin() {

        if (!USER_ADMIN || !USER_ADMIN_PASSWORD) {
            throw new AppError("USER_ADMIN e USER_ADMIN_PASSWORD devem estar configurados", 401);
        }

        const emailExiste = await User.findOne({ email: USER_ADMIN });

        if (emailExiste) {
            throw new AppError("E-mail já cadastrado, não é possível criar um admin padrão", 409);
        }

        const senhaHash = await bcrypt.hash(USER_ADMIN_PASSWORD, 10)

        const user = await User.create({
            name: "Administrador Aticurando",
            cpf: 12345678912,
            email: USER_ADMIN,
            senhaHash,
            papelUsuario: Papel_usuario.ADM,
            active: true,
            aceite_lgpd: true,
            photo : null
        })

        return {
            id: user._id,
            name: user.name,
            cpf: user.cpf,
            email: user.email,
            papel_usuario: user.papelUsuario,
            active: user.active,
            photo: user.photo
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

    public async updateOwnPhoto(id: string, photo: string) {
        const user = await User.findByIdAndUpdate(
            id,
            { photo },
            {
                new: true,
                runValidators: true
            }
        );

        if(!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        return {
            id: user._id,
            name: user.name,
            photo: user.photo
        };
    }

    public async delete(id: string) {
        return await User.findByIdAndDelete(id);
    }

    public async createProfessor (data: ICreateProfessorDTO){

        if (data.senha !== data.confirmarSenha){
            throw new AppError("As senhas não conferem", 400);
        }

        const emailExiste = await User.findOne({ email: data.email});
        if (emailExiste){
            throw new AppError("E-mail já cadastrado no sistema", 409);
        }

        const cpfExiste = await User.findOne({cpf: data.cpf});
        if (cpfExiste){
            throw new AppError("CPF já cadastrado no sistema", 409);
        }

        const senhaHash = await bcrypt.hash(data.senha,10);

        const professor = await User.create({
            name: data.name,
            cpf: data.cpf,
            email: data.email,
            senhaHash,
            dt_nascimento: data.dt_nascimento,
            estado_civil: data.estado_civil,
            telefone_principal: data.telefone_principal,
            ...(data.telefone_secundario !== undefined && { telefone_secundario: data.telefone_secundario }),
            papelUsuario: Papel_usuario.PROFESSOR,
            active: true,
            aceite_lgpd: data.aceite_lgpd,
            photo: data.photo ?? null,
            
        });

        return{
            id: professor._id,
            name: professor.name,
            cpf: professor.cpf,
            email: professor.email,
            papelUsuario: professor.papelUsuario,
            active: professor.active,
            lgpd: professor.aceite_lgpd,
            photo: professor.photo
        };
    }

    public async updateProfessor(id: string, data: IUpdateProfessorDTO) {

        const professor = await User.findById(id);
        if (!professor) {
            throw new AppError("Usuário não encontrado", 404);
        }
        
        if (professor.papelUsuario !== Papel_usuario.PROFESSOR) {
            throw new AppError("O usuário informado não é um professor", 400);
        }

        const dadosAtualizados: any = { ...data };

        if (data.senha) {
            dadosAtualizados.senhaHash = await bcrypt.hash(data.senha, 10);
            delete dadosAtualizados.senha; 
        }

        return await User.findByIdAndUpdate(id, dadosAtualizados, {
            new: true,
            runValidators: true,
        });
    }

    public async findAllProfessores() {
        return await User.find({ papelUsuario: Papel_usuario.PROFESSOR, active: true });
    }

    public async inactivateProfessor(id: string) {
        const professor = await User.findById(id);

        if (!professor) {
            throw new AppError("Usuário não encontrado", 404);
        }

        if (professor.papelUsuario !== Papel_usuario.PROFESSOR) {
            throw new AppError("O usuário informado não é um professor", 400);
        }

        if (!professor.active) {
            throw new AppError("Este professor já está inativo", 400);
        }

        professor.active = false;
        await professor.save();

        return {
            id: professor._id,
            name: professor.name,
            active: professor.active
        };
    }
}

export default new userService();