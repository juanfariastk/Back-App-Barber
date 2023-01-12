import  {Router} from 'express'
import User from './app/models/User'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const rotas = new Router()

rotas.post('/usuarios', UserController.store)
rotas.post('/sessoes', SessionController.store)
export default rotas;