import express from 'express'
import { cuentaDigitalController } from '../controllers/cuentadigital.controller'
import { clienteController } from '../controllers/cliente.controller'

const router = express.Router()

router.route('/').get(cuentaDigitalController.healthCheck)
router.route('/generateOTP').post(cuentaDigitalController.generateOTP)
router.route('/validateOTP').post(cuentaDigitalController.validateOTP)
router.route('/actualizarCliente').post(clienteController.actualizarCliente)
router.route('/getStatusActivacion').get(clienteController.getStatusActivacion)
router.route('/setStatusActivacion').post(clienteController.setStatusActivacion)
router.route('/getCliente').get(clienteController.getCliente)
module.exports = router
