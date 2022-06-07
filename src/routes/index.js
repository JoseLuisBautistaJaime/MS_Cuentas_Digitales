import express from 'express'
import { cuentaDigitalController } from '../controllers/cuentadigital.controller'
import { usuarioController } from '../controllers/usuario.controller'

const router = express.Router()

router.route('/').get(cuentaDigitalController.healthCheck)
router.route('/generateOTP').post(cuentaDigitalController.generateOTP)
router.route('/validateOTP').post(cuentaDigitalController.validateOTP)
router.route('/actualizarUsuario').post(usuarioController.actualizarUsuario)
router.route('/getEstatusActivacion').get(usuarioController.getEstatusActivacion)
router.route('/setEstatusActivacion').post(usuarioController.setEstatusActivacion)
module.exports = router
