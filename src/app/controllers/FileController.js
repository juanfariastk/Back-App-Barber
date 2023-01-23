import File from "../models/File";

class FileController{
    async store(requisicao, resposta){
        const {originalname:name, filename:path} = requisicao.file
        const file = await File.create({name, path})
        return resposta.json(file)
    }
}

export default new FileController();