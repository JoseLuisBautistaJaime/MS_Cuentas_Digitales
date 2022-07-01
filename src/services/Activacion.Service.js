import md5 from 'md5'
import * as OTPAuth from 'otpauth'
import { ComunicacionesService } from './Comunicaciones.Service'
import LOG from '../commons/LOG'
import { ActivacionDAO } from '../dao/Activacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import {
  CODE_BAD_REQUEST,
  CODE_INTERNAL_SERVER_ERROR
} from '../commons/constants'

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DIGITS = 4
const OTP_PERIOD = 300

function TOTP(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  LOG.debug(`TOTP-fullSecret ${fullSecret}`)
  const hashSecret = String(md5(fullSecret)).toUpperCase()
  return new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: OTP_DIGITS,
    period: OTP_PERIOD,
    secret: OTPAuth.Secret.fromUTF8(hashSecret)
  })
}

// ** Inicio: getEstatusActivacion
async function obtenerEstatusActivacion(idCliente) {
  return ActivacionDAO.obtenerEstatusActivacion(idCliente)
}

/**
 * SERV: Establece el estatus de actuvacion.
 * @param {*} idCliente el número idCliente.
 * @param {*} estatusActivacion El número del estatus de Activacion.
 */
async function establecerEstatusActivacion(idCliente, estatusActivacion) {
  LOG.info('SERV: Iniciando establecerEstatusActivacion')
  await ActivacionDAO.establecerEstatusActivacion(idCliente, estatusActivacion)
  LOG.info('SERV: Terminando establecerEstatusActivacion')
}

/**
 * SERV: para el envío del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (req, res, idCliente) => {
  LOG.info('SERV: Iniciando enviarOtp method')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  const codigoOtp = new TOTP(idCliente, cliente.idDevice).generate()
  try {
    const correoCliente = String(cliente.correoCliente)
    const celularCliente = String(cliente.celularCliente)
    const modoEnvio = String(req.body.modoEnvio).toLowerCase()

    LOG.debug(`MARK: #1 modoenvio ${modoEnvio}; correocliente:${correoCliente}; celularCliente:${celularCliente}`)
    // Validación del Token Otp..
    if (codigoOtp === null || codigoOtp === '') {
      const controlExcepcion = {
        code: CODE_BAD_REQUEST,
        message: 'BadRequest - Token no generado correctamente.'
      }
      return res.status(400).send({ controlExcepcion })
    }

    // Modo de envio de sms..
    if (modoEnvio !== 'sms' && modoEnvio !== 'email') {
      const controlExcepcion = {
        code: CODE_BAD_REQUEST,
        message: `BadRequest - El parametro en body 'modoEnvio' debe ser 'sms' o 'email'`
      }
      return res.status(400).send({ controlExcepcion })
    }

    let statusEnvio
    // envio de otp por email o sms
    if (modoEnvio === 'email')
      statusEnvio = await ComunicacionesService.enviarCodigoEMAIL(req, res, correoCliente, codigoOtp)
    if (modoEnvio === 'sms')
      statusEnvio = await ComunicacionesService.enviarCodigoSMS(req, res, celularCliente, codigoOtp)

    // verificar si existe alguna excepcion
    if (statusEnvio.statusRequest !== 201) {
      LOG.debugJSON('sendOtpToComunicaciones-statusEnvio', statusEnvio)
      const controlExcepcion = {
        code: CODE_INTERNAL_SERVER_ERROR,
        message: `Internal Server Error - ${statusEnvio.descripcionError}`
      }
      return res.status(500).send({ controlExcepcion })
    }

  } catch (err) {
    return ''
  }
  await establecerEstatusActivacion(idCliente, 3)
  LOG.info('SERV: Terminando enviarOtp method')
  return codigoOtp
}



/**
 * SERV: verificacion del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const verificarOtp = async (req, res, idCliente, codigoOtp, enviarEmail) => {
  LOG.info('SERV: Iniciando verificarOtp method')
  // validaciones y carga de parametros
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  LOG.debug(`prms-usuario: usuario ${idCliente}`)
  LOG.debug(`prms-tokenOtp: tokenOtp ${codigoOtp}`)

  // ejecición del proceso principal.
  const delta = new TOTP(idCliente, cliente.idDevice).validate({
    token: codigoOtp,
    window: 1
  })
  // LOG.debugJSON('proceso-eval delta', delta)
  let esValidoOtp = false
  if (delta === 0) esValidoOtp = true
  if (esValidoOtp) await establecerEstatusActivacion(idCliente, 4)
  LOG.debugJSON('prms-enviarEmail', enviarEmail)
  if (esValidoOtp === true && enviarEmail === 'true')
    await ComunicacionesService.enviarActivacionEMAIL(req, res, cliente)
  LOG.debugJSON('prms-isValidOtp', esValidoOtp)
  LOG.info('SERV: Terminando verificarOtp method')
  return esValidoOtp
}

export const ActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion,
  enviarOtp,
  verificarOtp
}
export default ActivacionService
