import express from 'express'
import { cuentaDigitalController } from '../controllers/cuentadigital.controller'
import { clienteController } from '../controllers/cliente.controller'

const router = express.Router()

router.route('/').get(cuentaDigitalController.healthCheck)
router.route('/sendOTP').post(cuentaDigitalController.sendOtp)
router.route('/verifyOTP').post(cuentaDigitalController.verifyOtp)
router.route('/actualizarCliente').post(clienteController.actualizarCliente)
router.route('/getStatusActivacion').get(clienteController.getStatusActivacion)
router.route('/setStatusActivacion').post(clienteController.setStatusActivacion)
router.route('/getCliente').get(clienteController.getCliente)
module.exports = router
