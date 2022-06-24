import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util, Response } from '../commons'
import { ActivacionService } from '../services/Activacion.Service'

const obtenerEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting obtenerEstatusActivacion')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await ActivacionService.obtenerEstatusActivacion(idCliente)
    LOG.info(`CTRL: Terminado obtenerEstatusActivacion`)
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const establecerEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Starting establecerEstatusActivacion')
  try {
    await Util.validateHeaderOAG(req)

    const { idCliente, estatusActivacion } = req.body
    await ActivacionService.establecerEstatusActivacion(
      idCliente,
      estatusActivacion
    )
    LOG.info('CTRL: Terminado establecerEstatusActivacion')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const enviarOtp = async (req, res) => {
  LOG.info('CTRL: Starting enviarOtp method')
  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    // proceso principal
    const idCliente = String(req.body.idCliente)
    const codigoOtp = await ActivacionService.enviarOtp(req, res, idCliente)
    if (codigoOtp === '') return res.status(500).send()

    // Termiancion del proceso...
    LOG.info('CTRL: Ending enviarOtp method')
    return res.status(200).send({ codigoOtp })
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const verificarOtp = async (req, res) => {
  LOG.info('CTRL: Starting verificarOtp method')
  try {
    // validaciones y carga de parametros
    await Util.validateHeaderOAG(req)

    const { idCliente, codigoOtp } = req.body
    const esValidoOtp = await ActivacionService.verificarOtp(
      req,
      res,
      idCliente,
      codigoOtp
    )

    LOG.info('CTRL: Ending verificarOtp method')
    return res.status(200).send({ esValidoOtp })
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ActivacionController = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion,
  enviarOtp,
  verificarOtp
}
