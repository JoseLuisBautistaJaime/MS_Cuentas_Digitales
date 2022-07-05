import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util, Response } from '../commons'
import { clienteActivacionService } from '../services/clienteActivacion.Service'

const obtenerEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Iniciando obtenerEstatusActivacion')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await clienteActivacionService.obtenerEstatusActivacion(idCliente)
    LOG.info(`CTRL: Terminado obtenerEstatusActivacion`)
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const establecerEstatusActivacion = async (req, res) => {
  LOG.info('CTRL: Iniciando establecerEstatusActivacion')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente, estatusActivacion } = req.body
    await clienteActivacionService.establecerEstatusActivacion(idCliente, estatusActivacion)
    LOG.info('CTRL: Terminado establecerEstatusActivacion')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const clienteActivacionController = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
