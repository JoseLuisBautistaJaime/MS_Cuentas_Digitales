import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { activacionEventoSchema } from '../models/activacionEvento.model'

const activacionEvento = Mongoose.model('ActivacionEvento', activacionEventoSchema)

async function agregarEvento(activacion) {
  LOG.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  return activacionEvento.create(activacion)
}
async function agregarEventoError(idCliente, mensaje) {
  LOG.info(`DAO: Ejecutando ActivacionEventoDAO.agregar`)
  const eventoError = { idCliente, estatusActivacion: 6, mensaje }
  return activacionEvento.create(eventoError)
}

async function listarEventos(idCliente, estatusActivacion) {
  LOG.info(`DAO: Iniciando ActivacionEventoDAO.listarEventos ${idCliente}, ${estatusActivacion}`)
  let filter
  if (estatusActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estatusActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  LOG.info(`DAO: Terminando ActivacionEventoDAO.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  LOG.info(`DAO: Iniciando ActivacionEventoDAO.removerEventos`)
  let filter
  if (estatusActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estatusActivacion }] }
  const toReturn = await activacionEvento.remove(filter)
  LOG.info(`DAO: Terminando ActivacionEventoDAO.removerEventos ${toReturn}`)
  return toReturn
}

export const ActivacionEventoDAO = {
  agregarEvento,
  agregarEventoError,
  listarEventos,
  removerEventos
}

export default ActivacionEventoDAO
