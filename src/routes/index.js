import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { ClienteActivacionController } from '../controllers/ClienteActivacion.Controller'
import { ActivacionEventoController } from '../controllers/ActivacionEvento.Controller'

const router = express.Router()

router.route('/cliente').post(ClienteController.setCliente)
router.route('/cliente').get(ClienteController.getCliente)
router.route('/cliente').delete(ClienteController.deleteCliente)

router.route('/cliente/estatusActivacion').get(ClienteActivacionController.getEstatusActivacion)

router.route('/cliente/estatusActivacion').post(ClienteActivacionController.setEstatusActivacion)

router.route('/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/verificarOtp').post(AuthOtpController.verificarOtp)

router.route('/activacionEvento/eventos').get(ActivacionEventoController.listarEventos)
router.route('/activacionEvento/eventos').delete(ActivacionEventoController.removerEventos)

export default router
