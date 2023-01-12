import jwt from 'jsonwebtoken'

import auth from '../../config/auth';
import User from "../models/User";


class SessionController{
    async store(requisicao, resposta){
        const {email, password} = requisicao.body
        
        const user = await User.findOne({where:{email}})

        if(!user){
            console.log(!(user))
            return resposta.status(401).json({error:'Usuario não existe!'})
        }

        if(!(await user.checkPassword(password))){
            return resposta.status(401).json({error:'Senha inválida!'})
        }

        const {id, nome} = user

        return resposta.json({user:{id, nome, email}, token:jwt.sign({id}, auth.secret, {expiresIn:auth.expiresIn} )})
    }
}

export default new SessionController();