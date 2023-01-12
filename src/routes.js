import  {Router} from 'express'
import User from './app/models/User'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

import authMiddle from './app/middleware/auth'

const rotas = new Router()

rotas.post('/usuarios', UserController.store)
rotas.post('/sessoes', SessionController.store)

rotas.use(authMiddle)

rotas.put('/usuarios', UserController.update)
export default rotas;