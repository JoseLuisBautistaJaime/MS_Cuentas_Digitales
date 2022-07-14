import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util } from '../commons'
import { AuthOtpService } from '../services/AuthOtp.Service'

const enviarOtp = async (req, res) => {
  try {
    await Util.controllerIniciando(req, 'enviarOtp', true, true)
    const idCliente = String(req.body.idCliente)
    const toReturn = await AuthOtpService.enviarOtp(req, res, idCliente)
    return Util.controllerTerminando(res, toReturn, 'enviarOtp')
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const verificarOtp = async (req, res) => {
  try {
    await Util.controllerIniciando(req, 'verificarOtp', true, true)
    const { idCliente, codigoOtp } = req.body
    let { enviarEmail } = req.body
    LOG.debug(`enviarEmail#1: ${enviarEmail}`)
    if (enviarEmail !== true && enviarEmail !== false) {
      enviarEmail = true
    }
    LOG.debug(`enviarEmail#2: ${enviarEmail}`)
    const toReturn = await AuthOtpService.verificarOtp(req, res, idCliente, codigoOtp, enviarEmail)
    return Util.controllerTerminando(res, toReturn, 'verificarOtp')
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
