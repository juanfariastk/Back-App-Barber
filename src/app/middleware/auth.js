import  jwt  from "jsonwebtoken"
import {promisify} from "util"
import authConf from '../../config/auth'


export default async (requisicao, resposta, prox) => {
    const auth_header = requisicao.headers.authorization 

    if(!auth_header){
        return resposta.status(401).json({error:"Token não existe"})
    }

    const [, token] = auth_header.split(' ')

    try{
        const decode = await promisify(jwt.verify)(token, authConf.secret )
        
        requisicao.userId = decode.id
        

        return prox()
    }catch(err){
        return resposta.status(401).json({error:"Token inválido"})
    }

    return prox()
} 