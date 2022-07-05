import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'
import { ActivacionEventoDAO } from './ActivacionEvento.DAO'

const Cliente = Mongoose.model('cliente', clienteSchema)

/**
 * Establece un estatus de activacion a un cliente especifico. Además es aqui donde se actualiza el activacionlogEvents.
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @param {*} estatusActivacion El número del estatus de activacion.
 * @returns Objeto Cliente
 */
async function establecerEstatusActivacion(idCliente, activacion) {
  LOG.info('DAO: Iniciando establecerEstatusActivacion')
  const result = await Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        activacion
      }
    },
    {
      new: true
    }
  )
  LOG.debugJSON('idCliente', idCliente)
  await ActivacionEventoDAO.agregar(activacion)
  LOG.info('DAO: Terminando establecerEstatusActivacion')
  return result
}

/**
 * Obtiene el estatus de activacion, si el cliente no existe, retornara como estatus 1: NoExisteCliente
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @returns Retorna el objeto EsatusActivacion.
 */
async function obtenerEstatusActivacion(idCliente) {
  let estatusActivacion = 1
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente !== null) {
    estatusActivacion = cliente.activacion.estatusActivacion
    if (estatusActivacion === '' || estatusActivacion === undefined) estatusActivacion = 2
  }
  return { estatusActivacion }
}

export const ActivacionDAO = {
  establecerEstatusActivacion,
  obtenerEstatusActivacion
}

export default ActivacionDAO
