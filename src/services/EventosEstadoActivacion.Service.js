import { log } from '../commons/log'
import { EventosEstadoActivacionDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/exceptions'

async function getEventos(idCliente, estadoActivacion, soloContar) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await EventosEstadoActivacionDAO.getEventos(idCliente, estadoActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  log.info(`SERV: Terminando EventosEstadoActivacionService.getEventos`)
  return toReturn
}

async function deleteEventos(idCliente, estadoActivacion) {
  await EventosEstadoActivacionDAO.deleteEventos(idCliente, estadoActivacion)
  log.debug(`EventosEstadoActivacionService.deleteEventos`)
}

export const EventosEstadoActivacionService = {
  getEventos,
  deleteEventos
}
