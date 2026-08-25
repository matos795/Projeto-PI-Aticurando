import mongoose from "mongoose";

class Database {
    public async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log("MongoDB conectado com sucesso!");
        } catch (err) { 
            console.error("Erro ao conectar ao MongoDB:", err); 
            process.exit(1);
        }
    }
}

export default new Database();