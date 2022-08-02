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

async function countEventosForBloqueo(idCliente) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventosForBloqueo`)
  const toReturn = await EventosEstadoActivacionDAO.getEventosForBloqueo(idCliente)
  log.info(`SERV: Terminando EventosEstadoActivacionService.getEventosForBloqueo`)
  return toReturn.length
}

async function deleteEventos(idCliente, estadoActivacion) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  await EventosEstadoActivacionDAO.deleteEventos(idCliente, estadoActivacion)
  log.info(`SERV: Terminando EventosEstadoActivacionService.deleteEventos`)
}

export const EventosEstadoActivacionService = {
  getEventos,
  countEventosForBloqueo,
  deleteEventos
}
