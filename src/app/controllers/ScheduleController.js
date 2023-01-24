import Appointment from "../models/Appointment";
import User from "../models/User";

import {startOfDay, endOfDay, parseISO} from 'date-fns'
import { Op } from "sequelize";

class ScheduleController{
    async index(requisicao, resposta){
        const check_user = await User.findOne({where:{id:requisicao.userId, provider:true}})

        if(!check_user){
            return resposta.status(401).json({error:'Usuário não é um provedor de serviços!'})
        }

        const {date} = requisicao.query
        const parse_date = parseISO(date)

        const appointments = await Appointment.findAll({where:{provider_id: requisicao.userId, canceled_at:null, date:{[Op.between]:[startOfDay(parse_date), endOfDay(parse_date)]}}, order:['date']}) 
        return resposta.json(appointments)
    }
}

export default new ScheduleController();