import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Response } from '../commons/response'
import { Util } from '../commons/utils'
import { ClienteService } from '../services/Cliente.Service'
import { ClienteValidator } from '../validator/cliente.validator'
import { handlerErrorValidation } from '../validator/message.mapping'
import { UController } from '../commons/UController'

const healthCheck = async (_req, res) => {
  return Response.Ok(res)
}

const actualizarCliente = async (req, res) => {
  return UController.invoke('actualizarCliente', req, res, true, async reqX => {
    return ClienteService.actualizarCliente(reqX.body)
  })
}

const obtenerCliente = async (req, res) => {
  LOG.info('CTRL: Starting obtenerCliente')
  try {
    // await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await ClienteService.obtenerCliente(idCliente)
    LOG.info('CTRL: Endig obtenerCliente')
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const removerCliente = async (req, res) => {
  LOG.info('CTRL: Starting removerCliente')
  try {
    // await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    await ClienteService.removerCliente(idCliente)
    LOG.info('CTRL: Endig removerCliente')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ClienteController = {
  healthCheck,
  obtenerCliente,
  removerCliente,
  actualizarCliente
}
export default ClienteController

