import "dotenv/config";
import app from "./app.js"
import database from "./config/database.js"

const PORT = process.env.PORT || 3000;

async function startServer():Promise<void> {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        })
    } catch (error) {
        console.error("Falha ao iniciar o servidor:", error);
        process.exit(1);
    }
};

startServer();