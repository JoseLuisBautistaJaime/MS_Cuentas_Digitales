import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { ActivacionController } from '../controllers/Activacion.Controller'
// var sslRootCAs = require('ssl-root-cas/latest')
// sslRootCAs.inject()

const router = express.Router()

router.route('/').get(ClienteController.healthCheck)

router.route('/actualizarCliente').post(ClienteController.actualizarCliente)
router.route('/obtenerCliente').get(ClienteController.obtenerCliente)
router
  .route('/obtenerEstatusActivacion')
  .get(ActivacionController.obtenerEstatusActivacion)

router
  .route('/establecerEstatusActivacion')
  .post(ActivacionController.establecerEstatusActivacion)

router.route('/enviarOtp').post(ActivacionController.enviarOtp)
router.route('/verificarOtp').post(ActivacionController.verificarOtp)

export default router
