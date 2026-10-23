import mongoose from 'mongoose';

const uri = process.env.MONGO_URI as string;

if (!uri) {
  throw new Error('A variável de ambiente MONGO_URI não foi definida.');
}

export async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
      family: 4 // Força o uso de IPv4 para evitar timeouts no Windows
    });
    console.log("Sucesso ao conectar-se ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}