import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { ClienteActivacionController } from '../controllers/ClienteActivacion.Controller'
import { ActivacionEventoController } from '../controllers/ActivacionEvento.Controller'

const router = express.Router()

// router.route('/').get(ClienteController.healthCheck)

router.route('/actualizarCliente').post(ClienteController.actualizarCliente)
router.route('/obtenerCliente').get(ClienteController.obtenerCliente)
router.route('/removerCliente').post(ClienteController.removerCliente)

router.route('/obtenerEstatusActivacion').get(ClienteActivacionController.obtenerEstatusActivacion)

router.route('/establecerEstatusActivacion').post(ClienteActivacionController.establecerEstatusActivacion)

router.route('/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/verificarOtp').post(AuthOtpController.verificarOtp)

router.route('/activacionEvento/eventos').get(ActivacionEventoController.listarEventos)
router.route('/activacionEvento/eventos').delete(ActivacionEventoController.removerEventos)

export default router
