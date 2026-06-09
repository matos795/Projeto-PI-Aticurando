import User from "./user.model.js";
import {
    Papel_usuario,
    type IUpdateUserDTO
} from "./user.types.js";
import bcrypt from "bcryptjs";
import type { IRegisterDTO } from "../auth/auth.types.js";

class userService {
    public async create(data: IRegisterDTO){
        const emailExiste = await User.findOne({email:data.email});

        if (emailExiste){
            throw new Error("E-mail já cadastrado, insira um e-mail válido ou faça login")
        }

        const cpfExiste = await User.findOne({cpf: data.cpf});

        if (cpfExiste){
            throw new Error("CPF já cadastrado, insira um CPF válido ou faça login")
        }

        const senhaHash = await bcrypt.hash(data.senha, 10)

        const user = await User.create({
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        senhaHash,
        papelUsuario: Papel_usuario.ALUNO,
        active: true
        })

        return {id: user._id, 
                name: user.name,
                cpf: user.cpf,
                email: user.email,
                papel_usuario: user.papelUsuario,
                active: user.active};
    }

    public async findAll(){
        return await User.find();
    }

    public async findById(id: string){
        return await User.findById(id);
    }

    public async update(id: string, data: IUpdateUserDTO){
        return await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
    }

    public async delete(id: string){
        return await User.findByIdAndDelete(id);
    }
}

export default new userService();