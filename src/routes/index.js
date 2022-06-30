import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { ActivacionController } from '../controllers/Activacion.Controller'

const router = express.Router()

router.route('/').get(ClienteController.healthCheck)

router.route('/actualizarCliente').post(ClienteController.actualizarCliente)
router.route('/obtenerCliente').get(ClienteController.obtenerCliente)
router.route('/removerCliente').post(ClienteController.removerCliente)
router
  .route('/obtenerEstatusActivacion')
  .get(ActivacionController.obtenerEstatusActivacion)

router
  .route('/establecerEstatusActivacion')
  .post(ActivacionController.establecerEstatusActivacion)

router.route('/enviarOtp').post(ActivacionController.enviarOtp)
router.route('/verificarOtp').post(ActivacionController.verificarOtp)

export default router
