import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { eventoEstadoActivacionSchema } from '../models/eventoEstadoActivacion.model'

const activacionEvento = Mongoose.model('ActivacionEvento', eventoEstadoActivacionSchema)

async function agregarEvento(activacion) {
  log.info(`DAO: Ejecutando EventosEstadoActivacionDAO.agregar`)
  return activacionEvento.create(activacion)
}
async function agregarEventoError(idCliente, mensaje) {
  log.info(`DAO: Ejecutando EventosEstadoActivacionDAO.agregar`)
  const eventoError = { idCliente, estadoActivacion: 6, mensaje }
  return activacionEvento.create(eventoError)
}

async function getEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.getEventos ${idCliente}, ${estadoActivacion}`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.getEventos`)
  return toReturn
}

async function deleteEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.deleteEventos`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.remove(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.deleteEventos ${toReturn}`)
  return toReturn
}

export const EventosEstadoActivacionDAO = {
  agregarEvento,
  agregarEventoError,
  getEventos,
  deleteEventos
}
