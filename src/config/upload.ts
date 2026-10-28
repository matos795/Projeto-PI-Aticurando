import multer from "multer"; //Recebe o arquivo enviado pelo estudante
import path from "node:path"; //Cria caminhos de pastas e caminhos
import fs from "node:fs"; //Trabalha com pastas e arquivos
import crypto from "node:crypto"; //Cria nome aleatórios para não deixar o nome se repetir

const storagePath = path.resolve("storage"); //Obtém o caminho exato da pasta storage

fs.mkdirSync(storagePath, { recursive: true }) //Aqui a pasta é criada, caso não exista ainda

//Destination: Determina onde a imagem será salva, no caso no storagePath, que é a pasta Storage
//Filename: Cria um identificado único para cada imagem 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    },


    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo = `${crypto.randomUUID()}${extensao}`;

        cb(null, nomeArquivo)
    }
});

export const upload = multer({
    storage,

    //Aqui onde limitamos a foto para apenas 5mb
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    //Aqui onde criamos a condição de aceitar JPEG, PNG e WebP
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];
        if(tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Formato de imagem não permitido"));
        }
    }
});
