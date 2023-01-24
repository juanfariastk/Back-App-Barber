import  {Router} from 'express';
import multer from 'multer';
import multerConf from './config/multer'

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddle from './app/middleware/auth';

import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController' 
import AvailableController from './app/controllers/AvailableController';

const rotas = new Router()
const upload = multer(multerConf)

rotas.post('/usuarios', UserController.store)
rotas.post('/sessoes', SessionController.store)

rotas.use(authMiddle)

rotas.post('/arquivos', upload.single('arquivo') , FileController.store)
rotas.put('/usuarios', UserController.update)

rotas.get('/provedor', ProviderController.index)
rotas.get('/provedor/:providerId/disponivel', AvailableController.index)

rotas.post('/agendamentos', AppointmentController.store)
rotas.get('/agendamentos', AppointmentController.index)
rotas.delete('/agendamentos/:id', AppointmentController.delete)

rotas.get('/cronograma', ScheduleController.index)
rotas.get('/notificacoes', NotificationController.index)

rotas.put('/notificacoes/:id', NotificationController.update )

export default rotas;