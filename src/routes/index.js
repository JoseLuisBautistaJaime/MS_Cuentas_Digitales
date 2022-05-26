import express from 'express'
import { cuentaDigitalController } from '../controllers/cuentadigital.controller'

const router = express.Router()

router.route('/').get(cuentaDigitalController.healthCheck)

module.exports = router
