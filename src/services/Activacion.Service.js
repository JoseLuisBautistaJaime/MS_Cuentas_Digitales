import md5 from 'md5'
import * as OTPAuth from 'otpauth'
import { ClienteService } from './Cliente.Service'
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

// ** Inicio: getEstatusActivacion
async function getStatusActivacion(idCliente) {
  return ActivacionDAO.getStatusActivacion(idCliente)
}

async function setStatusActivacion(idCliente, statusActivacion) {
  await ActivacionDAO.setStatusActivacion(idCliente, statusActivacion)
}

const sendOtp = async (req, res, idCliente) => {
  LOG.info('CTRL: Starting sendOTP method')

  // validaciones y carga de parametros
  // proceso principal
  const cliente = await ClienteService.getCliente(idCliente)
  const codeOtp = new TOTP(idCliente, cliente.idDevice).generate()
  try {
    await ComunicacionesService.sendOtpToComunicaciones(
      req,
      res,
      String(req.body.modeSend).toLowerCase(),
     
      cliente,
     
      cod
    eOtp
    )
  } catch (err) {
    return ''
  }
  await setStatusActivacion(idCliente, 3)
  // Termiancion del proceso...
  LOG.info('CTRL: Ending sendOTP method')
  return codeOtp
}

const verifyOtp = async (idCliente, codeOtp) => {
  LOG.info('Service: Starting validateOTP method')
  // validaciones y carga de parametros
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  LOG.info(`prms-usuario: usuario ${idCliente}`)
  LOG.info(`prms-tokenOtp: tokenOtp ${codeOtp}`)

  // ejecición del proceso principal.
  const delta = new TOTP(idCliente, cliente.idDevice).validate({
    token: codeOtp,
    window: 1
  })
  // LOG.debugJSON('proceso-eval delta', delta)
  let isValidOtp = false
  if (delta === 0) isValidOtp = true
  if (isValidOtp) await setStatusActivacion(idCliente, 4)
  // LOG.debugJSON('proceso-eval isValidOtp', isValidOtp)
  return isValidOtp
}

export const ActivacionService = {
  getStatusActivacion,
  setStatusActivacion,
  sendOtp,
  verifyOtp
}
export default ActivacionService
