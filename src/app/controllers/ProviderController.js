import User from "../models/User";
import File from "../models/File";

class ProviderController{
    async index(requisicao, resposta){
         const provider = await User.findAll({where:{provider:true}, attributes:['id', 'name', 'email', 'avatar_id'], include:[{model:File, as:'avatar', attributes:['name', 'path', 'url']}]})
         return resposta.json(provider)
    }
}

export default new ProviderController();