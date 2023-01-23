import User from '../models/User';
import File from '../models/File';

import Appointment from '../models/Appointment'
import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore} from 'date-fns'

class AppointmentController{
    async index(requisicao, resposta){
        const appointments = await Appointment.findAll({where:{user_id:requisicao.userId, canceled_at:null}, order:['date'],attributes:['id','date'] , include:[{model:User, as:'provider', attributes:['id', 'name'], include:[{model:File, as:'avatar', attributes:['id', 'path', 'url']}] }]})
        return resposta.json(appointments)
    }

    async store(requisicao, resposta){
        const schema = Yup.object().shape({provider_id:Yup.number().required(),date:Yup.date().required()})

        if(!(await schema.isValid(requisicao.body))){
            return resposta.status(400).json({error:"Erro de Validação"})
        }

        const {provider_id, date} = requisicao.body
        const is_provider = await User.findOne({where:{id:provider_id, provider:true}})

        if(!is_provider){
            return resposta.status(401).json({error:"Defina um provedor de serviço para criar um agendamento!"})
        }

        const hour_start = startOfHour(parseISO(date))
        
        if(isBefore(hour_start, new Date())){
            return resposta.status(400).json({error:'Data invalida'})
        }

        const check_avaliable = await Appointment.findOne({where:{provider_id, canceled_at:null, date:hour_start}})
        
        if(check_avaliable){
            return resposta.status(400).json({error:"Data indisponível para agendar"})
        }

        const appointment = await Appointment.create({user_id:requisicao.userId, provider_id, date,})
        return resposta.json(appointment)
    }
}

export default new AppointmentController();