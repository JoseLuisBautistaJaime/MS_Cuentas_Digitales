import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util, Response } from '../commons'
import { AuthOtpService } from '../services/AuthOtp.Service'

const enviarOtp = async (req, res) => {
  LOG.info('******************************************************************')
  LOG.info('******************************************************************')
  LOG.info('CTRL: Iniciando enviarOtp method')

  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    // proceso principal
    const idCliente = String(req.body.idCliente)
    const result = await AuthOtpService.enviarOtp(req, res, idCliente)
    if (result === '') return res.status(500).send()

    // Termiancion del proceso...
    LOG.debugJSON('enviarOtp-codigoOtp', result)
    LOG.info('CTRL: Terminando enviarOtp')
    const { code } = result
    delete result.code
    return res.status(code).send(result)
  } catch (err) {
    // LOG.info('CTRL: Endig removerCliente-ERRORo')
    LOG.error(err)
    return handleError(res, err)
  }
}

const verificarOtp = async (req, res) => {
  LOG.info('CTRL: Iniciando verificarOtp method')
  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    const { idCliente, codigoOtp } = req.body
    let { enviarEmail } = req.body
    if (enviarEmail === undefined || enviarEmail === null) enviarEmail = true
    const result = await AuthOtpService.verificarOtp(req, res, idCliente, codigoOtp, enviarEmail)

    LOG.info('CTRL: Terminando verificarOtp')
    const { code } = result
    delete result.code
    return res.status(code).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
