import LOG from '../commons/LOG'
// import { clienteSchema } from '../models/cliente.model'
// import { bloqueoActivacionEventoSchema } from '../models/bloqueoActivacionEvento.model'
import { activacionEventoDAO } from '../dao/activacionEvento.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/pi8-controller-exceptions'

async function listarEventos(idCliente, estatusActivacion, soloContar) {
  LOG.info(`SERV: Iniciando activacionEventoService.listarEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await activacionEventoDAO.listarEventos(idCliente, estatusActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  LOG.info(`SERV: Terminando activacionEventoService.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  await activacionEventoDAO.removerEventos(idCliente, estatusActivacion)
  LOG.debug(`activacionEventoService.removerEventos`)
}

export const activacionEventoService = {
  listarEventos,
  removerEventos
}
