import md5 from 'md5'
import * as OTPAuth from 'otpauth'
import { ComunicacionesService } from './Comunicaciones.Service'
import LOG from '../commons/LOG'
import { ActivacionDAO } from '../dao/Activacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DIGITS = 4
const OTP_PERIOD = 120

function TOTP(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRET}.${idCliente}.${idDevice}`
  LOG.info(`paso 6. fullSecret ${fullSecret}`)
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
  LOG.info('SERV: Starting establecerEstatusActivacion')
  await ActivacionDAO.establecerEstatusActivacion(idCliente, estatusActivacion)
  LOG.info('SERV: Starting establecerEstatusActivacion')
}

/**
 * SERV: para el envío del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (req, res, idCliente) => {
  LOG.info('SERV: Starting enviarOtp method')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  const codigoOtp = new TOTP(idCliente, cliente.idDevice).generate()
  try {
    await ComunicacionesService.sendOtpToComunicaciones(
      req,
      res,
      String(req.body.modoEnvio).toLowerCase(),
      cliente,
      codigoOtp
    )
  } catch (err) {
    return ''
  }
  await establecerEstatusActivacion(idCliente, 3)
  LOG.info('SERV: Ending enviarOtp method')
  return codigoOtp
}

/**
 * SERV: verificacion del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const verificarOtp = async (req, res, idCliente, codigoOtp) => {
  LOG.info('Service: Starting validateOTP method')
  // validaciones y carga de parametros
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  LOG.info(`prms-usuario: usuario ${idCliente}`)
  LOG.info(`prms-tokenOtp: tokenOtp ${codigoOtp}`)

  // ejecición del proceso principal.
  const delta = new TOTP(idCliente, cliente.idDevice).validate({
    token: codigoOtp,
    window: 1
  })
  // LOG.debugJSON('proceso-eval delta', delta)
  let esValidoOtp = false
  if (delta === 0) esValidoOtp = true
  if (esValidoOtp) await establecerEstatusActivacion(idCliente, 4)
  if (esValidoOtp)
    await ComunicacionesService.enviarActivacionEMAIL(req, res, cliente)

  LOG.debugJSON('proceso-eval isValidOtp', esValidoOtp)
  return esValidoOtp
}

export const ActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion,
  enviarOtp,
  verificarOtp
}
export default ActivacionService
