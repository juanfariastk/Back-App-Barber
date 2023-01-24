import 'dotenv/config';

import express  from 'express';
import 'express-async-errors';

import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';

import rotas from './routes'; 
import './database';

import sentry_conf from './config/sentry';

class App{
    constructor(){
        this.servidor = express()

        Sentry.init(sentry_conf)

        this.middle_ware()
        this.rotas_serv()
        this.exceptionHandler()
    }

    middle_ware(){
        this.servidor.use(Sentry.Handlers.requestHandler())
        this.servidor.use(express.json())
        this.servidor.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads' )))
    }

    rotas_serv(){
        this.servidor.use(rotas)
        this.servidor.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler(){
        this.servidor.use(async(error, requisicao, resposta, prox) => { if(process.env.NODE_ENV =='development'){const errors = await new Youch(error, requisicao).toJSON(); return resposta.status(500).json(error);  }} )
        
    }

}

export default new App().servidor;