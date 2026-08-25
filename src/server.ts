import "dotenv/config";
import app from "./app.js"
import database from "./config/database.js"
import User from "./modules/user/user.model.js";
import { Papel_usuario } from "./modules/user/user.types.js";
import userService from "./modules/user/user.service.js";

const PORT = process.env.PORT || 3000;

async function startServer():Promise<void> {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        })

        if(!await User.findOne({papelUsuario: Papel_usuario.ADM})){
            const user = await userService.createAdmin();
            console.log(`${user.email}`)
        }

    } catch (error) {
        console.error("Falha ao iniciar o servidor:", error);
        process.exit(1);
    }
};

startServer();