import express  from 'express';
import path from 'path';
import rotas from './routes';
import './database';

class App{
    constructor(){
        this.servidor = express()

        this.middle_ware()
        this.rotas_serv()
    }

    middle_ware(){
        this.servidor.use(express.json())
        this.servidor.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads' )))
    }

    rotas_serv(){
        this.servidor.use(rotas)
    }

}

export default new App().servidor;