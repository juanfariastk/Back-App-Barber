import User from "../models/User";
import * as Yup from 'yup';

class UserController{
    //face mirror
    async store(requisicao, resposta){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password:Yup.string().required().min(6),
        })

        if(!(await schema.isValid(requisicao.body))){
            return resposta.status(400).json({error:"Erro de validação"})
        }

        const userExists = await User.findOne({where:{ email: requisicao.body.email}})

        if(userExists){
            return resposta.status(400).json({error:"Usuário já existe!"})
        }

        const {id, name, email, provider } = await User.create(requisicao.body)
        return resposta.json({id, name, email, provider})
    }

    async update(requisicao, resposta){
        const schema = Yup.object().shape({
            name:Yup.string(),
            email:Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field ) => oldPassword ? field.required() : field),
            confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field ),

        })

        if(! (await schema.isValid(requisicao. body))){
            return resposta.status(400).json({error:"Erro de Validação"})
        }

        const {email, oldPassword} = requisicao.body
        const user = await User.findByPk(requisicao.userId)

        if(email != user.email ){
            const userExists = await User.findOne({where:{email: requisicao.body.email}})
            if (userExists){
                return status(400).json({error:"Usuário já existe!"})
            }
        }

        if( oldPassword && !( await user.checkPassword(oldPassword)) ){
            return resposta.status(401).json({error:"Senhas não coincidem"})
        }

        const {id , name, provider } = await user.update(requisicao.body)

        return resposta.json({id, name, email, provider})
    }
}

export default new UserController();