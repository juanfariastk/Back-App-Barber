import User from "../models/User";
import Notification from "../schemas/Notification";

class NotificationController{
    async index(requisicao, resposta){
        const check_user = await User.findOne({where:{id:requisicao.userId, provider:true}})

        if(!check_user){
            return resposta.status(401).json({error:"Notificações exclusivas para usuarios provedores."})
        }

        const notifications = await Notification.find({ user:requisicao.userId}).sort({createdAt: 'desc'}).limit(20)
        return resposta.json(notifications)
    }

    async update(requisicao, resposta){
        const notification = await Notification.findByIdAndUpdate(requisicao.params.id, {read:true}, {new:true})
        return resposta.json(notification)
    }
}

export default new NotificationController();