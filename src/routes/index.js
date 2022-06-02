import express from 'express'
import { cuentaDigitalController } from '../controllers/cuentadigital.controller'

const router = express.Router()

router.route('/').get(cuentaDigitalController.healthCheck)
router.route('/generateOTP').post(cuentaDigitalController.generateOTP)
router.route('/validateOTP').post(cuentaDigitalController.validateOTP)

module.exports = router
