/* eslint-disable import/named */
/* eslint-disable camelcase */
import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { EstadoActivacionController } from '../controllers/EstadoActivacion.Controller'
import { EventosEstadoActivacionController } from '../controllers/EventosEstadoActivacion.Controller'

const router = express.Router()

// v1
router.route('/actualizarCliente').post(ClienteController.actualizarCliente)
router.route('/obtenerCliente').get(ClienteController.obtenerCliente)
router.route('/removerCliente').post(ClienteController.removerCliente)

router.route('/obtenerEstatusActivacion').get(EstadoActivacionController.obtenerEstatusActivacion)
router.route('/establecerEstatusActivacion').post(EstadoActivacionController.establecerEstatusActivacion)

router.route('/activacionEvento/eventos').get(EventosEstadoActivacionController.listarEventos)
router.route('/activacionEvento/eventos').delete(EventosEstadoActivacionController.removerEventos)

router.route('/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/verificarOtp').post(AuthOtpController.verificarOtp)
export default router
