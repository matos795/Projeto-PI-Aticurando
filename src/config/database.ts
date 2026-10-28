import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('A variável de ambiente MONGODB_URI não foi definida.');
}

  try {
    await mongoose.connect(uri);
    console.log("Sucesso ao conectar-se ao MongoDB!");
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
}