/*
 * Proyecto:        NMP - CUENTA DIGITAL.
 * Quarksoft S.A.P.I. de C.V. – Todos los derechos reservados. Para uso exclusivo de Nacional Monte de Piedad.
 */
import * as OTPAuth from 'otpauth'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import mongo from '../service/mongo.service'
import { CommonValidator } from '../validator/common.validator'
import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
import handlerError from '../validator/handler-error'
import { CuentaDigitalValidator } from '../validator/cuentadigital.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { ComunicacionesController } from './comunicaciones.controller'

const healthCheck = async (req, res) => {
  return Response.Ok(res)
}
const otpauthSecret = '666666'

const createTOTP = (usuario) => {
  let TOTP = new OTPAuth.TOTP({
    issuer: 'NMP',
    label: 'experiencia2',
    algorithm: 'SHA512',
    digits: 4,
    period: 60,
    secret: otpauthSecret
  })
  return TOTP
}


const generateOTP = async (req, res) => {
  LOG.info('CTRL: Starting generateOTP method')
  try {
    // validaciones y carga de parametros
    await CommonValidator.validateHeaderOAG(req)
    const validator = CuentaDigitalValidator.ValidatorSchema.validate(
      req.body,
      CuentaDigitalValidator.generateOPTRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)
    const { usuario, destinatario, tipo } = req.body
    LOG.debugJSON('prms-usuario: usuario', usuario)
    LOG.debugJSON('prms-destinatario: destinatario', destinatario)
    LOG.debugJSON('prms-tokenOtp: tipo', tipo)

    // ejecición del proceso principal.
    let TOTP = new createTOTP(usuario)
    const tokenOtp = TOTP.generate()

    LOG.debugJSON('proceso-eval: tokenOtp', tokenOtp)

    if (tokenOtp === null || tokenOtp === '') {
      const controlExcepcion = {
        codigo: CODE_INTERNAL_SERVER_ERROR,
        mensaje: MESSAGE_ERROR
      }
      const response = {
        controlExcepcion
      }
      return res.status(500).send(response)
    }


    // proceso: Validacion del campo tipo, para el envio de SMS.
    if (tipo !== 'SMS' && tipo !== 'EMAIL') {
      const controlExcepcion = {
        codigo: CODE_INTERNAL_SERVER_ERROR,
        mensaje: `${MESSAGE_ERROR} (la variable 'tipo' debe tener un valor de 'EMAIL' o 'SMS')`
      }
      const response = {
        controlExcepcion
      }
      return res.status(500).send(response)
    }

    // proceso: Envío del OTP por sms o email, especificado el el tipo
    if (tipo === 'EMAIL') {
      const statusEmail = await ComunicacionesController.enviarCodigoEMAIL(req, res, destinatario, tokenOtp )
      LOG.debugJSON('statusEmail', statusEmail)
      if (statusEmail.statusRequest !== 201) {
        return res.status(500).send(statusEmail)
      }
    }
    if (tipo === 'SMS') {
      const statusSMS = await ComunicacionesController.enviarCodigoSMS(req, res, destinatario, tokenOtp)
      LOG.debugJSON('statusSMS', statusSMS)
      if (statusSMS.statusRequest !== 201) {
        return res.status(500).send(statusSMS)
      }
    }

    // Termiancion del proceso...
    const response = {
      codigoVerificacion: tokenOtp
    }
    LOG.info('CTRL: Ending generateOTP method')
    return res.status(200).send(response)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

const validateOTP = async (req, res) => {
  LOG.info('CTRL: Starting validateOTP method')
  try {
    // validaciones y carga de parametros
    await CommonValidator.validateHeaderOAG(req)
    const { usuario, otp } = req.body;
    LOG.debugJSON('prms-usuario: usuario', usuario)
    LOG.debugJSON('prms-tokenOtp: tokenOtp', otp)

    // ejecición del proceso principal.
    let TOTP = new createTOTP(usuario)
    let delta = TOTP.validate({
      token: otp,
      window: 1
    })
    LOG.debugJSON('proceso-eval delta',delta)
    let isValidOtp = false
    if (delta === 0) isValidOtp = true
    LOG.debugJSON('proceso-eval isValidOtp', isValidOtp)

    if (isValidOtp === false) {
      const controlExcepcion = {
        codigo: CODE_INTERNAL_SERVER_ERROR,
        mensaje: MESSAGE_ERROR
      }
      const response = {
        controlExcepcion
      }
      return res.status(500).send(response)
    }

    // Termiancion del proceso...
    const response = {
      IsValid: true
    }
    LOG.info('CTRL: Ending validateOTP method')
    return res.status(200).send(response)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

export const cuentaDigitalController = {
  healthCheck,
  generateOTP,
  validateOTP
}
export default cuentaDigitalController
