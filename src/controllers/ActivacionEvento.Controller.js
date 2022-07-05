import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util } from '../commons'
// import { ActivacionService } from '../services/Activacion.Service'
import { ActivacionEventoService } from '../services/ActivacionEvento.Service'

const listarEventos = async (req, res) => {
  LOG.info('CTRL: Iniciando obtenerActivacionEventos')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const { estatusActivacion } = req.query
    const result = await ActivacionEventoService.listarEventos(idCliente, estatusActivacion)
    LOG.info(`CTRL: Terminado obtenerActivacionEventos ${idCliente}`)
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

const removerEventos = async (req, res) => {
  LOG.info('CTRL: Iniciando removerEventos')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const { estatusActivacion } = req.query
    await ActivacionEventoService.removerEventos(idCliente, estatusActivacion)
    LOG.info(`CTRL: Terminado removerEventos ${idCliente}`)
    return res.status(200).send()
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ActivacionEventoController = {
  listarEventos,
  removerEventos
}

export default ActivacionEventoController
