import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { eventoEstadoActivacionSchema } from '../models/eventoEstadoActivacion.model'

const activacionEvento = Mongoose.model('ActivacionEvento', eventoEstadoActivacionSchema)

async function agregarEvento(activacion) {
  log.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  return activacionEvento.create(activacion)
}
async function agregarEventoError(idCliente, mensaje) {
  log.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  const eventoError = { idCliente, estadoActivacion: 6, mensaje }
  return activacionEvento.create(eventoError)
}

async function getEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.getEventos ${idCliente}, ${estadoActivacion}`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando ActivacionEventoDAO.getEventos`)
  return toReturn
}

async function deleteEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.deleteEventos`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.remove(filter)
  log.info(`DAO: Terminando ActivacionEventoDAO.deleteEventos ${toReturn}`)
  return toReturn
}

export const ActivacionEventoDAO = {
  agregarEvento,
  agregarEventoError,
  getEventos,
  deleteEventos
}

export default ActivacionEventoDAO
