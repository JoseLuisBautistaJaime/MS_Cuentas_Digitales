import LOG from '../commons/LOG'
import handleError from '../validator/handler-error'
import { Util } from '../commons'
// import { ActivacionService } from '../services/Activacion.Service'
import { ActivacionEventoService } from '../services/ActivacionEvento.Service'

const obtenerActivacionEventos = async (req, res) => {
  LOG.info('CTRL: Iniciando obtenerActivacionEventos')
  try {
    await Util.validateHeaderOAG(req)
    const { idCliente } = req.query
    const result = await ActivacionEventoService.obtenerActivacionEventos(idCliente)
    LOG.info(`CTRL: Terminado obtenerActivacionEventos ${idCliente}`)
    return res.status(200).send(result)
  } catch (err) {
    LOG.error(err)
    return handleError(res, err)
  }
}

export const ActivacionEventoController = {
  obtenerActivacionEventos
}

export default ActivacionEventoController
