import { log } from '../commons/log'
import { ActivacionEventoDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/exceptions'

async function getEventos(idCliente, estadoActivacion, soloContar) {
  log.info(`SERV: Iniciando ActivacionEventoService.getEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await ActivacionEventoDAO.getEventos(idCliente, estadoActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  log.info(`SERV: Terminando ActivacionEventoService.getEventos`)
  return toReturn
}

async function deleteEventos(idCliente, estadoActivacion) {
  await ActivacionEventoDAO.deleteEventos(idCliente, estadoActivacion)
  log.debug(`ActivacionEventoService.deleteEventos`)
}

export const ActivacionEventoService = {
  getEventos,
  deleteEventos
}
