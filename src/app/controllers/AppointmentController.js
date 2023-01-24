import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Appointment from '../models/Appointment'

import * as Yup from 'yup';
import ptBR from 'date-fns/locale/pt-BR'
import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns'

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController{
    async index(requisicao, resposta){
        const {page = 1} = requisicao.query
        const appointments = await Appointment.findAll({where:{user_id:requisicao.userId, canceled_at:null}, order:['date'],attributes:['id','date', 'past', 'cancelable'] , limit:20, offset:(page-1)*20 , include:[{model:User, as:'provider', attributes:['id', 'name'], include:[{model:File, as:'avatar', attributes:['id', 'path', 'url']}] }]})
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
        
        if(provider_id == requisicao.userId){
            return resposta.status(400).json({error:"Um provedor não pode marcar horário consigo mesmo!"})
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
        
        const user = await User.findByPk(requisicao.userId)
        const format_date = format(hour_start, "'dia' dd 'de' MMMM', ás' H:mm'h'" , {locale:ptBR} )
        await Notification.create({content:`Novo agendamento do usuário ${user.name} para a data ${format_date}`, user:provider_id,})

        return resposta.json(appointment)
    }

    async delete(requisicao, resposta){
        const appointment = await Appointment.findByPk(requisicao.params.id, {include:[{model:User, as:'provider', attributes:['name', 'email']}]})

        if(appointment.user_id != requisicao.userId){
            return resposta.status(401).json({error:"Apenas um usuário autorizado pode cancelar um agendamento."})
        }

        const date_wit = subHours(appointment.date, 2)
        if(isBefore(date_wit, new Date())){
            return resposta.status(401).json({error:"Não é possivel cancelar um agendamento faltando menos de 2 horas."})
        }

        appointment.canceled_at = new Date()

        await Queue.add(CancellationMail.key, {appointment,})
        await appointment.save()

        return resposta.json(appointment)
    }
}

export default new AppointmentController();