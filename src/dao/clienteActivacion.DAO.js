import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'
import { ActivacionEventoDAO } from './ActivacionEvento.DAO'

const Cliente = Mongoose.model('cliente', clienteSchema)

/**
 * Convierte de un número de EstatusActivacion a un String que contiene el estatus activacion nombre.
 * @param {*} estatusActivacion El número del estatus de activacion.
 * @returns Nombre del estatus de activacion.
 */
export function convertirEstatusActivacionNombre(estatusActivacion) {
  let result
  switch (String(estatusActivacion)) {
    case '0':
      result = ''
      break
    case '1':
      result = 'NoExisteCliente_Activacion'
      break
    case '2':
      result = 'Prospecto_Activacion'
      break
    case '3':
      result = 'OtpGenerado_Activacion'
      break
    case '4':
      result = 'Activado_Activacion'
      break
    case '5':
      result = 'Bloqueado_Activacion'
      break
    case '6':
      result = 'Error_Activacion'
      break
    default:
  }
  return result
}

/**
 * Establece un estatus de activacion a un cliente especifico. Además es aqui donde se actualiza el activacionlogEvents.
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @param {*} estatusActivacion El número del estatus de activacion.
 * @returns Objeto Cliente
 */
async function establecerEstatusActivacion(idCliente, activacion) {
  LOG.info('DAO: Iniciando establecerEstatusActivacion')
  LOG.debugJSON('ActivacionDAO.establecerEstatusActivacion', activacion)
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
  await ActivacionEventoDAO.agregarEvento(activacion)
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
  let activacion = {}
  if (cliente === null || cliente === undefined) {
    activacion.estatusActivacion = 1
  } else {
    activacion = cliente.activacion
    estatusActivacion = cliente.activacion.estatusActivacion
    if (estatusActivacion === '' || estatusActivacion === undefined) estatusActivacion = 2
    activacion.estatusActivacion = estatusActivacion
  }
  activacion.estatusActivacionNombre = convertirEstatusActivacionNombre(activacion.estatusActivacion)
  return activacion
}

export const ActivacionDAO = {
  establecerEstatusActivacion,
  obtenerEstatusActivacion,
  convertirEstatusActivacionNombre
}

export default ActivacionDAO
