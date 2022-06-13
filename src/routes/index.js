import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { ActivacionController } from '../controllers/Activacion.Controller'
// var sslRootCAs = require('ssl-root-cas/latest')
// sslRootCAs.inject()

const router = express.Router()

router.route('/').get(ClienteController.healthCheck)

router.route('/actualizarCliente').post(ClienteController.actualizarCliente)
router.route('/getCliente').get(ClienteController.getCliente)
router
  .route('/getStatusActivacion')
  .get(ActivacionController.getStatusActivacion)

router
  .route('/setStatusActivacion')
  .post(ActivacionController.setStatusActivacion)

router.route('/sendOtp').post(ActivacionController.sendOtp)
router.route('/verifyOtp').post(ActivacionController.verifyOtp)

export default router
