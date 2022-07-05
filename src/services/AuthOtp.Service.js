import md5 from 'md5'
import { totp } from 'otplib'
import { ComunicacionesService } from './Comunicaciones.Service'
import { clienteActivacionService } from './clienteActivacion.Service'
import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { CODE_BAD_REQUEST, CODE_INTERNAL_SERVER_ERROR } from '../commons/constants'

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DURACION_SEGUNDOS = 120
const OTP_OPTIONS = {
  digits: 4,
  algorithm: 'sha1',
  step: OTP_DURACION_SEGUNDOS,
  window: 2
}
function generateHashSecret(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  LOG.debug(`TOTP-fullSecret ${fullSecret}`)
  const hashSecret = String(md5(fullSecret)).toUpperCase()
  return hashSecret
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

  /** generacion del Token */
  totp.options = OTP_OPTIONS
  LOG.debugJSON('OPTIONLS:', OTP_OPTIONS)
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const codigoOtp = totp.generate(hashSecret)
  const expiraCodigoOtp = parseInt((Date.now() + OTP_DURACION_SEGUNDOS * 1000) / 1000, 10)
  const expiraCodigoOtpISO = new Date(expiraCodigoOtp * 1000).toISOString()

  // const expiraCodigoOtp = new Date(
  //   dateNow.getTime() + OTP_DURACION_SEGUNDOS * 1000
  // )

  /** envio del codigoOtp por sms o email */
  try {
    const correoCliente = String(cliente.correoCliente)
    const celularCliente = String(cliente.celularCliente)
    const modoEnvio = String(req.body.modoEnvio).toLowerCase()

    LOG.debug(
      `MARK: #1 codigoOtp: ${codigoOtp}; modoenvio ${modoEnvio}; correocliente:${correoCliente}; celularCliente:${celularCliente}`
    )
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
  await clienteActivacionService.establecerEstatusActivacion(idCliente, 3)
  LOG.info('SERV: Terminando enviarOtp method')
  return { codigoOtp, expiraCodigoOtp, expiraCodigoOtpISO }
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

  totp.options = OTP_OPTIONS
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const esValidoOtp = totp.check(codigoOtp, hashSecret)

  if (esValidoOtp) await clienteActivacionService.establecerEstatusActivacion(idCliente, 4)
  LOG.debugJSON('prms-enviarEmail', enviarEmail)
  if (esValidoOtp === true && enviarEmail === 'true')
    await ComunicacionesService.enviarActivacionEMAIL(req, res, cliente)
  LOG.debugJSON('prms-isValidOtp', esValidoOtp)
  LOG.info('SERV: Terminando verificarOtp method')
  return esValidoOtp
}

export const AuthOtpService = {
  enviarOtp,
  verificarOtp
}
export default AuthOtpService
