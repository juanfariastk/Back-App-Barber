import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Mail from "../../lib/Mail";

class CancellationMail{
    get key(){
        return 'CancellationMail';
    }
    
    async handle({data}){
        const { appointment } = data
        await Mail.sendMail({ to:`${appointment.provider.name} <${appointment.provider.email}>`, subject: 'Agendamento Cancelado!', text:'Você tem um agendamento cancelado!'  })
    }
}

export default new CancellationMail();