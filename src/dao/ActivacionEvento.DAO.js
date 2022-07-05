import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { activacionEventoSchema } from '../models/ActivacionEvento.model'

const activacionEvento = Mongoose.model('ActivacionEvento', activacionEventoSchema)

async function agregar(activacion) {
  LOG.info(`DAO: Ejecutando ActivacionEventoDAO.obtenerActivacionEventos`)
  return activacionEvento.create(activacion)
}

async function obtenerActivacionEventos(idCliente) {
  LOG.info(`DAO: Ejecutando ActivacionEventoDAO.obtenerActivacionEventos ${idCliente}`)
  return activacionEvento.find({ idCliente })
}

export const ActivacionEventoDAO = {
  agregar,
  obtenerActivacionEventos
}

export default ActivacionEventoDAO
