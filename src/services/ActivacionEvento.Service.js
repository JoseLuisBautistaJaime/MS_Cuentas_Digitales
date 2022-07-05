// import Mongoose from 'mongoose'

// import Mongoose from 'mongoose'
// import LOG from '../commons/LOG'
// import { clienteSchema } from '../models/cliente.model'
// import { bloqueoActivacionEventoSchema } from '../models/bloqueoActivacionEvento.model'
import { ActivacionEventoDAO } from '../dao/ActivacionEvento.DAO'

// const Cliente = Mongoose.model('cliente', bloqueoActivacionEventosSchema)
async function obtenerActivacionEventos(idCliente) {
  // activacion.idCliente = idCliente
  // LOG.debugJSON('ActivacionEventoDAO.agregar:', activacion)
  return ActivacionEventoDAO.obtenerActivacionEventos(idCliente)
  // return `test:obtenerActivacionEventos: ${idCliente}`
}

export const ActivacionEventoService = {
  obtenerActivacionEventos
}
export default ActivacionEventoService
