import { toInteger } from 'lodash'
import { log } from '../commons/log'
import { EstadoActivacionDAO } from '../dao/EstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from '../constants/constants'
import { NotFoundCliente } from '../commons/exceptions'

/**
 * SERV: Establece el estatus de actuvacion.
 * @param {*} idCliente el número idCliente.
 * @param {*} estadoActivacion El número del estatus de Activacion.
 */
async function setEstadoActivacion(idCliente, estadoActivacion, codigoOtp) {
  log.info('SERV: Iniciando setEstadoActivacion')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  const activacion = {
    idCliente,
    estadoActivacion,
    estadoActivacionNombre: EstadoActivacionDAO.convertirEstadoActivacionNombre(estadoActivacion),
    ultimaActualizacion: Date.now()
  }
  log.debug(`setEstadoActivacion: idCliente: ${idCliente} activacion: ${estadoActivacion}, codigoOtp: ${codigoOtp} `)
  if (codigoOtp !== undefined) activacion.codigoOtp = codigoOtp
  await EstadoActivacionDAO.setEstadoActivacion(idCliente, activacion)
  log.info('SERV: Terminando setEstadoActivacion')
  // eslint-disable-next-line no-use-before-define
  return getEstadoActivacion(idCliente)
}

const unixTimeStamp = (fecha, addSeconds) => toInteger(fecha.getTime() / 1000, 10) + toInteger(addSeconds)

// ** Inicio: getEstadoActivacion
async function getEstadoActivacion(idCliente) {
  log.info('SERV: Iniciando getEstadoActivacion')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  const activacion = await EstadoActivacionDAO.getEstadoActivacion(idCliente)

  // evaluar desbloqueo de cuenta, en caso de estar bloqueada
  log.debug(`estadoActivacion ${activacion.estadoActivacion}`)

  // Conversion de valores generales
  const toReturn = {}
  toReturn.estadoActivacion = activacion.estadoActivacion
  toReturn.estadoActivacionNombre = activacion.estadoActivacionNombre

  //  Conversion de valores especializados
  toReturn.ultimaActualizacion = activacion.ultimaActualizacion
  if (toReturn.estadoActivacion === 5) {
    toReturn.expiraBloqueo = unixTimeStamp(toReturn.ultimaActualizacion, ACTIVACION_EVENTOS_TIMETOLIVE)
    toReturn.expiraBloqueoISO = new Date(toReturn.expiraBloqueo * 1000).toISOString()
  }
  if (toReturn.estadoActivacion === 3) toReturn.codigoOtp = activacion.codigoOtp
  log.info(`SERV: Terminando getEstadoActivacion ${toReturn}`)
  return toReturn
}

export const EstadoActivacionService = {
  getEstadoActivacion,
  setEstadoActivacion
}
