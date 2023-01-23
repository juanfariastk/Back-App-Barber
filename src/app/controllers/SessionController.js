import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import auth from '../../config/auth';
import User from "../models/User";


class SessionController{
    async store(requisicao, resposta){
        const schema = Yup.object().shape({
            email:Yup.string().email().required(),
            password: Yup.string().required()
        })

        if(!(await schema.isValid(requisicao.body))){
            return resposta.status(400).json({error:"Erro de validação"})
        }

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