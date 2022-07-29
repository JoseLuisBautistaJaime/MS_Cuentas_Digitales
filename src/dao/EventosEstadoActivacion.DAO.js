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

async function listarEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.listarEventos ${idCliente}, ${estadoActivacion}`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando ActivacionEventoDAO.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.removerEventos`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.remove(filter)
  log.info(`DAO: Terminando ActivacionEventoDAO.removerEventos ${toReturn}`)
  return toReturn
}

export const ActivacionEventoDAO = {
  agregarEvento,
  agregarEventoError,
  listarEventos,
  removerEventos
}

export default ActivacionEventoDAO
