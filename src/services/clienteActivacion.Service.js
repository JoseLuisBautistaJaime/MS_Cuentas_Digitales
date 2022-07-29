import { toInteger } from 'lodash'
import { log } from '../commons/log'
import { ActivacionDAO } from '../dao/ClienteActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from '../commons/constants'
import { NotFoundCliente } from '../commons/controller-exceptions'

/**
 * SERV: Establece el estatus de actuvacion.
 * @param {*} idCliente el número idCliente.
 * @param {*} estatusActivacion El número del estatus de Activacion.
 */
async function establecerEstatusActivacion(idCliente, estatusActivacion, codigoOtp) {
  log.info('SERV: Iniciando establecerEstatusActivacion')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  const activacion = {
    idCliente,
    estatusActivacion,
    estatusActivacionNombre: ActivacionDAO.convertirEstatusActivacionNombre(estatusActivacion),
    ultimaActualizacion: Date.now()
  }
  log.debug(`establecerEstatusActivacion: idCliente: ${idCliente} activacion: ${estatusActivacion}, codigoOtp: ${codigoOtp} `)
  if (codigoOtp !== undefined) activacion.codigoOtp = codigoOtp
  await ActivacionDAO.establecerEstatusActivacion(idCliente, activacion)
  log.info('SERV: Terminando establecerEstatusActivacion')
  // eslint-disable-next-line no-use-before-define
  return obtenerEstatusActivacion(idCliente, false)
}

const unixTimeStamp = (fecha, addSeconds) => toInteger(fecha.getTime() / 1000, 10) + toInteger(addSeconds)

// ** Inicio: getEstatusActivacion
async function obtenerEstatusActivacion(idCliente) {
  log.info('SERV: Iniciando obtenerEstatusActivacion')

  const activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)

  // evaluar desbloqueo de cuenta, en caso de estar bloqueada
  log.debug(`estatusActivacion ${activacion.estatusActivacion}`)

  // Conversion de valores generales
  const toReturn = {}
  // toReturn.code = activacion.estatusActivacion === 5 ? 203 : 201
  // toReturn.code = activacion.estatusActivacion === 1 ? 400 : toReturn.code
  toReturn.estatusActivacion = activacion.estatusActivacion
  toReturn.estatusActivacionNombre = activacion.estatusActivacionNombre

  //  Conversion de valores especializados
  if (toReturn.estatusActivacion >= 2) toReturn.ultimaActualizacion = activacion.ultimaActualizacion
  if (toReturn.estatusActivacion === 5) {
    toReturn.expiraBloqueo = unixTimeStamp(toReturn.ultimaActualizacion, ACTIVACION_EVENTOS_TIMETOLIVE)
    toReturn.expiraBloqueoISO = new Date(toReturn.expiraBloqueo * 1000).toISOString()
  }
  if (toReturn.estatusActivacion === 3) toReturn.codigoOtp = activacion.codigoOtp
  log.info(`SERV: Terminando obtenerEstatusActivacion ${toReturn}`)
  return toReturn
}

export const ClienteActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}

export default ClienteActivacionService
