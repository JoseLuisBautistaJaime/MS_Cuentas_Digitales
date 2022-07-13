import LOG from '../commons/LOG'
// import { clienteSchema } from '../models/cliente.model'
// import { bloqueoActivacionEventoSchema } from '../models/bloqueoActivacionEvento.model'
import { ActivacionEventoDAO } from '../dao/ActivacionEvento.DAO'

async function listarEventos(idCliente, estatusActivacion, soloContar) {
  LOG.info(`SERV: Iniciando ActivacionEventoService.listarEventos`)
  let toReturn = await ActivacionEventoDAO.listarEventos(idCliente, estatusActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  LOG.info(`SERV: Terminando ActivacionEventoService.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  await ActivacionEventoDAO.removerEventos(idCliente, estatusActivacion)
  LOG.debug(`ActivacionEventoService.removerEventos`)
}

export const ActivacionEventoService = {
  listarEventos,
  removerEventos
}
