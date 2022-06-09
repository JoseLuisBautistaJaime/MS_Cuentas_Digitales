/*
 * Proyecto:        NMP - CUENTA DIGITAL.
 * Quarksoft S.A.P.I. de C.V. – Todos los derechos reservados. Para uso exclusivo de Nacional Monte de Piedad.
 */
import * as OTPAuth from 'otpauth'
import md5 from 'md5'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import mongo from '../service/mongo.service'
import { CommonValidator } from '../validator/common.validator'
import { CODE_INTERNAL_SERVER_ERROR, MESSAGE_ERROR } from '../constansts'
import handlerError from '../validator/handler-error'
import { CuentaDigitalValidator } from '../validator/cuentadigital.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { ComunicacionesController } from './comunicaciones.controller'
import { clienteController } from './cliente.controller'

const healthCheck = async (req, res) => {
  return Response.Ok(res)
}
// const OTP_SECRET = '802312F9BDB98FF3E4F465BC18FF7F96'
const OTP_SECRET = '666666'
const OTP_DIGITS = 4
const OTP_PERIOD = 60

async function generateCodeOtp(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  LOG.debugJSON('paso 6. fullSecret', fullSecret)
  const hashSecret = String(md5(fullSecret)).toUpperCase()
  LOG.debugJSON('paso 7. hashSecret', hashSecret)
  const totp = new OTPAuth.TOTP({
    issuer: 'NMP',
    label: 'experiencia2',
    algorithm: 'SHA512',
    digits: OTP_DIGITS,
    period: OTP_PERIOD,
    secret: OTP_SECRET
  })
  LOG.debugJSON('paso 8. generate', totp)
  const tokenOtp = totp.generate()
  LOG.debugJSON('paso 8. tokenOtp', tokenOtp)
  return tokenOtp
}

const createTOTP = () => {
  const TOTP = new OTPAuth.TOTP({
    issuer: 'NMP',
    label: 'experiencia2',
    algorithm: 'SHA512',
    digits: OTP_DIGITS,
    period: OTP_PERIOD,
    secret: OTP_SECRET
  })
  return TOTP
}

async function sendOtp_toComunicaciones(req, res, modeSend, cliente, tokenOtp) {
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)
  LOG.debugJSON('sendOtp_toComunicaciones-correoCliente', correoCliente)
  LOG.debugJSON('sendOtp_toComunicaciones-celularCliente', celularCliente)

  // validacion de excepciones..
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
  if (modeSend !== 'sms' && modeSend !== 'email') {
    const controlExcepcion = {
      codigo: CODE_INTERNAL_SERVER_ERROR,
      mensaje: `${MESSAGE_ERROR} (la variable 'modeSend' debe tener un valor de 'EMAIL' o 'SMS')`
    }
    const response = {
      controlExcepcion
    }
    return res.status(500).send(response)
  }

  // envio de otp por email o sms
  if (modeSend === 'email') {
    const statusEmail = await ComunicacionesController.enviarCodigoEMAIL(req, res, correoCliente, tokenOtp)
    LOG.debugJSON('statusEmail', statusEmail)
    if (statusEmail.statusRequest !== 201) {
      return res.status(500).send(statusEmail)
    }
  }
  if (modeSend === 'sms') {
    const statusSMS = await ComunicacionesController.enviarCodigoSMS(req, res, celularCliente, tokenOtp)
    LOG.debugJSON('statusSMS', statusSMS)
    if (statusSMS.statusRequest !== 201) {
      return res.status(500).send(statusSMS)
    }
  }
}

const sendOtp = async (req, res) => {
  LOG.info('CTRL: Starting sendOTP method')
  try {
    // validaciones y carga de parametros
    // await CommonValidator.validateHeaderOAG(req)
    // const validator = CuentaDigitalValidator.ValidatorSchema.validate(
    //   req.body,
    //   CuentaDigitalValidator.sendOtpRequest
    // )
    // if (validator.errors.length) handlerErrorValidation(validator)

    const idCliente = String(req.body.idCliente)
    LOG.debugJSON('paso 1. CLIENTE', idCliente)
    const cliente = await clienteController.getClienteInternal(idCliente)
    LOG.debugJSON('paso 2. CLIENTE', cliente)
    if (cliente === null || cliente === undefined) {
      const controlExcepcion = {
        codigo: CODE_INTERNAL_SERVER_ERROR,
        mensaje: MESSAGE_ERROR
      }
      const response = {
        controlExcepcion
      }
      return res.status(500).send(response)
    }

    // Generacion del codigo OTP
    LOG.debugJSON('paso 3. cliente.idDevice', String(cliente.idDevice))
    const codeOtp = await generateCodeOtp(idCliente, String(cliente.idDevice))

    LOG.debugJSON('paso 4. codeOtp', codeOtp)
    //  Envio del codigo otp..
    const modeSend = String(req.body.modeSend).toLowerCase()
    await sendOtp_toComunicaciones(req, res, modeSend, cliente, codeOtp)

    // Termiancion del proceso...
    const response = {
      codeOtp
    }
    LOG.info('CTRL: Ending sendOTP method')
    return res.status(200).send(response)
  } catch (err) {
    LOG.error(err)
    return handlerError(res, err)
  }
}

const verifyOtp = async (req, res) => {
  LOG.info('CTRL: Starting validateOTP method')
  try {
    // validaciones y carga de parametros
    await CommonValidator.validateHeaderOAG(req)
    const { idCliente, codeOtp } = req.body
    LOG.debugJSON('prms-usuario: usuario', idCliente)
    LOG.debugJSON('prms-tokenOtp: tokenOtp', codeOtp)

    // ejecición del proceso principal.
    let TOTP = new createTOTP()
    let delta = TOTP.validate({
      token: codeOtp,
      window: 1
    })
    LOG.debugJSON('proceso-eval delta', delta)
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
  sendOtp,
  verifyOtp
}
export default cuentaDigitalController
