import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'
import { ActivacionEventoDAO } from './EventosEstadoActivacion.DAO'

const Cliente = Mongoose.model('cliente', clienteSchema)

/**
 * Convierte de un número de EstatusActivacion a un String que contiene el estatus activacion nombre.
 * @param {*} estatusActivacion El número del estatus de activacion.
 * @returns Nombre del estatus de activacion.
 */
export function convertirEstatusActivacionNombre(estatusActivacion) {
  let result
  const strStatusActivacion = String(estatusActivacion)
  switch (strStatusActivacion) {
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
async function setEstadoActivacion(idCliente, activacion) {
  log.info('DAO: Iniciando setEstadoActivacion')
  log.debug(`ActivacionDAO.setEstadoActivacion ${activacion}`)
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
  log.debugJSON('idCliente', idCliente)
  await ActivacionEventoDAO.agregarEvento(activacion)
  log.info('DAO: Terminando setEstadoActivacion')
  return result
}

/**
 * Obtiene el estatus de activacion, si el cliente no existe, retornara como estatus 1: NoExisteCliente
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @returns Retorna el objeto EsatusActivacion.
 */
async function getEstadoActivacion(idCliente) {
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  let activacion = {}
  if (cliente === null || cliente === undefined) {
    activacion.estatusActivacion = 1
  } else {
    activacion = cliente.activacion
    activacion.estatusActivacion = cliente.activacion.estatusActivacion
  }
  activacion.estatusActivacionNombre = `${convertirEstatusActivacionNombre(activacion.estatusActivacion)} ${idCliente}`
  return activacion
}

export const ActivacionDAO = {
  setEstadoActivacion,
  getEstadoActivacion,
  convertirEstatusActivacionNombre
}

export default ActivacionDAO
