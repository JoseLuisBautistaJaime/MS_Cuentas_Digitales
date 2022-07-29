import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { EstadoActivacionController } from '../controllers/EstadoActivacion.Controller'
import { ActivacionEventoController } from '../controllers/EventosEstadoActivacion.Controller'

const router = express.Router()

router.route('/cliente').post(ClienteController.setCliente)
router.route('/cliente').get(ClienteController.getCliente)
router.route('/cliente').delete(ClienteController.deleteCliente)

router.route('/cliente/estadoActivacion').get(EstadoActivacionController.getEstadoActivacion)
router.route('/cliente/estadoActivacion').post(EstadoActivacionController.setEstadoActivacion)
router.route('/cliente/estadoActivacion/eventos').get(ActivacionEventoController.getEventos)
router.route('/cliente/estadoActivacion/eventos').delete(ActivacionEventoController.deleteEventos)

router.route('/cliente/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/cliente/verificarOtp').post(AuthOtpController.verificarOtp)


export default router
