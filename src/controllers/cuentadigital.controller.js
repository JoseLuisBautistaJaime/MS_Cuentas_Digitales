/*
 * Proyecto:        NMP - CUENTA DIGITAL.
 * Quarksoft S.A.P.I. de C.V. – Todos los derechos reservados. Para uso exclusivo de Nacional Monte de Piedad.
 */
import * as OTPAuth from 'otpauth'
import md5 from 'md5'
import Base32 from 'base32'
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

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DIGITS = 4
const OTP_PERIOD = 60

function TOTP(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  LOG.debugJSON('paso 6. fullSecret', fullSecret)
  const hashSecret = String(md5(fullSecret)).toUpperCase()
  const totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: OTP_DIGITS,
    period: OTP_PERIOD,
    secret: OTPAuth.Secret.fromUTF8(hashSecret)
  })
  return totp
}

async function sendOtpToComunicaciones(req, res, modeSend, cliente, tokenOtp) {
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
  return true
}

const sendOtp = async (req, res) => {
  LOG.info('CTRL: Starting sendOTP method')
  try {
    // validaciones y carga de parametros
    await CommonValidator.validateHeaderOAG(req)
    const validator = CuentaDigitalValidator.ValidatorSchema.validate(
      req.body,
      CuentaDigitalValidator.sendOtpRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)

    // proceso principal
    const idCliente = String(req.body.idCliente)
    const cliente = await clienteController.getClienteInternal(res, idCliente)
    const codeOtp = new TOTP(idCliente, cliente.idDevice).generate() 
    await sendOtpToComunicaciones(req, res, String(req.body.modeSend).toLowerCase(), cliente, codeOtp)
    await clienteController.setStatusActivacionInternal(idCliente, 3)

    // Termiancion del proceso...
    LOG.info('CTRL: Ending sendOTP method')
    return res.status(200).send({ codeOtp })
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
    const cliente = await clienteController.getClienteInternal(res, idCliente)

    LOG.debugJSON('prms-usuario: usuario', idCliente)
    LOG.debugJSON('prms-tokenOtp: tokenOtp', codeOtp)

    // ejecición del proceso principal.
    const delta = new TOTP(idCliente, cliente.idDevice).validate({token: codeOtp, window:1})
    LOG.debugJSON('proceso-eval delta', delta)
    let isValidOtp = false
    if (delta === 0) isValidOtp = true
    if (isValidOtp)
      await clienteController.setStatusActivacionInternal(idCliente, 4)

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
