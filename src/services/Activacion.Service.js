import md5 from 'md5'
import * as OTPAuth from 'otpauth'
import { ComunicacionesService } from './Comunicaciones.Service'
import LOG from '../commons/LOG'
import { ActivacionDAO } from '../dao/Activacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'

// Cambiar a variables de ambiente
const OTP_SECRET = '465465465465sgdfgsdfa4ardsgasgsasdag'
const OTP_DIGITS = 4
const OTP_PERIOD = 60

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

async function establecerEstatusActivacion(idCliente, statusActivacion) {
  await ActivacionDAO.establecerEstatusActivacion(idCliente, statusActivacion)
}

const enviarOtp = async (req, res, idCliente) => {
  LOG.info('CTRL: Starting enviarOtp method')

  // validaciones y carga de parametros
  // proceso principal
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
  // Termiancion del proceso...
  LOG.info('CTRL: Ending enviarOtp method')
  return codigoOtp
}

const verificarOtp = async (idCliente, codigoOtp) => {
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
  // LOG.debugJSON('proceso-eval isValidOtp', isValidOtp)
  return esValidoOtp
}

export const ActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion,
  enviarOtp,
  verificarOtp
}
export default ActivacionService
