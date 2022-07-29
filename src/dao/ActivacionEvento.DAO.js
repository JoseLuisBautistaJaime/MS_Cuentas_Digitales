import Mongoose from 'mongoose'
import { log } from '../commons/pi8-log'
import { activacionEventoSchema } from '../models/activacionEvento.model'

const activacionEvento = Mongoose.model('ActivacionEvento', activacionEventoSchema)

async function agregarEvento(activacion) {
  log.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  return activacionEvento.create(activacion)
}
async function agregarEventoError(idCliente, mensaje) {
  log.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  const eventoError = { idCliente, estatusActivacion: 6, mensaje }
  return activacionEvento.create(eventoError)
}

async function listarEventos(idCliente, estatusActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.listarEventos ${idCliente}, ${estatusActivacion}`)
  let filter
  if (estatusActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estatusActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando ActivacionEventoDAO.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  log.info(`DAO: Iniciando ActivacionEventoDAO.removerEventos`)
  let filter
  if (estatusActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estatusActivacion }] }
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
