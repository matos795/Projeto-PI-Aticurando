import User from "./user.model.js";
import type {
    ICreateUserDTO,
    IUpdateUserDTO
} from "./user.types.js";

class userService {
    public async create(data: ICreateUserDTO){
        const user = await User.create({
        name: data.name,
        cpf: data.cpf
        })

        return user;
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