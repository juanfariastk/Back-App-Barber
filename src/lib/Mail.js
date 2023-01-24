import nodemailer from 'nodemailer'
import mail from '../config/mail';


class Mail{
    constructor(){
        const {host, port, secure, auth} = mail
        this.transporter = nodemailer.createTransport({ host, port, secure, auth: auth.user ? auth : null })

    }

    sendMail(msg){
        return this.transporter.sendMail( {...mail.default, ...msg })
    }
}

export default new Mail();