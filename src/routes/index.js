import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { ClienteActivacionController } from '../controllers/EstadoActivacion.Controller'
import { ActivacionEventoController } from '../controllers/EventosEstadoActivacion.Controller'

const router = express.Router()

router.route('/cliente').post(ClienteController.setCliente)
router.route('/cliente').get(ClienteController.getCliente)
router.route('/cliente').delete(ClienteController.deleteCliente)

router.route('/cliente/estatusActivacion').get(ClienteActivacionController.getEstadoActivacion)
router.route('/cliente/estatusActivacion').post(ClienteActivacionController.setEstadoActivacion)
router.route('/cliente/estatusActivacion/eventos').get(ActivacionEventoController.listarEventos)
router.route('/cliente/estatusActivacion/eventos').delete(ActivacionEventoController.removerEventos)

router.route('/cliente/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/cliente/verificarOtp').post(AuthOtpController.verificarOtp)


export default router
