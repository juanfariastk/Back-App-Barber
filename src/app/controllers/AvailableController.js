import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from "date-fns"
import { Op } from "sequelize"
import Appointment from '../models/Appointment'

class AvailableController{
    async index(requisicao, resposta){
        const {date} = requisicao.query
        
        if(!date){
            return resposta.status(400).json({error:'Defina uma data para pesquisa!'})
        }
         
        const data_search = Number(date)

        //forma para retornar os dados dos agendamentos já realizados com a verificação se foram cancelados antes de enviar o objeto.
        const appointments = await Appointment.findAll({where:{ provider_id:requisicao.params.providerId, canceled_at:null, date:{ [Op.between]:[startOfDay(data_search), endOfDay(data_search)] }}})

        const schedule = [ '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

        const available_time = schedule.map( data => { 
            const [ hour, minute ] = data.split(':')
            const value = setSeconds(setMinutes(setHours(data_search, hour),minute), 0) 

            return {data, value:format(value, "yyyy-MM-dd'T'HH:mm:ssxxx", ), available:isAfter(value, new Date()) && !appointments.find(e => format(e.date, 'HH:mm') === data)}
         } )
        return resposta.json(available_time)
    }
}

export default new AvailableController();