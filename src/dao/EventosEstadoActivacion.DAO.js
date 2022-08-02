import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { eventoEstadoActivacionSchema } from '../models/eventoEstadoActivacion.model'
import { ESTADO_ACTIVACION_OTPGENERADO, ESTADO_ACTIVACION_ERROR } from '../constants/constants'

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

async function getEventosForBloqueo(idCliente) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.getEventosForBloqueo ${idCliente}`)
  const filter = {
    $and: [{ idCliente }, { $or: [{ estadoActivacion: ESTADO_ACTIVACION_OTPGENERADO }, { estadoActivacion: ESTADO_ACTIVACION_ERROR }] }]
  }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.getEventosForBloqueo`)
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
  getEventosForBloqueo,
  deleteEventos
}
