import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { EstadoActivacionController } from '../controllers/EstadoActivacion.Controller'
import { EventosEstadoActivacionController } from '../controllers/EventosEstadoActivacion.Controller'

const router = express.Router()

router.route('/cliente/:idCliente').post(ClienteController.setCliente)
router.route('/cliente/:idCliente').get(ClienteController.getCliente)
router.route('/cliente/:idCliente').delete(ClienteController.deleteCliente)

router.route('/cliente/:idCliente/estadoActivacion').get(EstadoActivacionController.getEstadoActivacion)
router.route('/cliente/:idCliente/estadoActivacion').post(EstadoActivacionController.setEstadoActivacion)
router.route('/cliente/:idCliente/estadoActivacion/eventos').get(EventosEstadoActivacionController.getEventos)
router.route('/cliente/:idCliente/estadoActivacion/eventos').delete(EventosEstadoActivacionController.deleteEventos)

router.route('/cliente/:idCliente/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/cliente/:idCliente/verificarOtp').post(AuthOtpController.verificarOtp)
export default router
