import express from 'express'
import { ClienteController } from '../controllers/ClienteController' 
// var sslRootCAs = require('ssl-root-cas/latest')
// sslRootCAs.inject()

const router = express.Router()

router.route('/').get(ClienteController.healthCheck)

router.route('/actualizarCliente').post(ClienteController.actualizarCliente)

export default router
