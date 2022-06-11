import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { handlerErrorValidation } from '../validator/message.mapping'
import { Response } from '../commons/response'
import ClienteValidator from '../validator/cliente.validator'
import { Util } from '../commons/utils'
import { ClienteService } from '../services/Cliente.Services'

const healthCheck = async (req, res) => {
  return Response.Ok(res)
}

const actualizarCliente = async (req, res) => {
  LOG.info('CTRL: Starting actualizarUsuario method')
  try {
    await Util.validateHeaderOAG(req)
    const validator = ClienteValidator.ValidatorSchema.validate(
      req.body,
      ClienteValidator.clienteRequest
    )
    if (validator.errors.length) handlerErrorValidation(validator)
    const resultSave = await ClienteService.actualizarCliente(req.body)
    LOG.info(`CTRL: Usuario Actualizado ${resultSave}`)
    LOG.info('CTRL: Endig actualizarUsuario method')
    return Response.Ok(res)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ClienteController = {
  actualizarCliente,
  healthCheck
}
