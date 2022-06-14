import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util } from '../commons/utils'
import { ActivacionService } from '../services/Activacion.Service'
import { Response } from '../commons/response'

const getStatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting getStatusActivacion')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await ActivacionService.getStatusActivacion(idCliente)
    LOG.info(`CTRL: Terminado getStatusActivacion ${result.statusActivacion}`)
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const setStatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting setStatusActivacion')
  try {
    await Util.validateHeaderOAG(req)

    const { idCliente, statusActivacion } = req.body
    await ActivacionService.setStatusActivacion(idCliente, statusActivacion)
    LOG.info('CTRL: Terminado setStatusActivacion')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const sendOtp = async (req, res) => {
  LOG.info('CTRL: Starting sendOTP method')
  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    // proceso principal
    const idCliente = String(req.body.idCliente)
    const codeOtp = await ActivacionService.sendOtp(req, res, idCliente)
    if (codeOtp === '') return res.status(500).send()

    // Termiancion del proceso...
    LOG.info('CTRL: Ending sendOTP method')
    return res.status(200).send({ codeOtp })
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const verifyOtp = async (req, res) => {
  LOG.info('CTRL: Starting verifyOtp method')
  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    const { idCliente, codeOtp } = req.body
    const isValidOtp = await ActivacionService.verifyOtp(idCliente, codeOtp)

    LOG.info('CTRL: Ending validateOTP method')
    return res.status(200).send({ isValidOtp })
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ActivacionController = {
  getStatusActivacion,
  setStatusActivacion,
  sendOtp,
  verifyOtp
}
export default ActivacionController
