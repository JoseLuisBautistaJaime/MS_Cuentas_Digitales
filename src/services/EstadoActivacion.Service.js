import { toInteger } from 'lodash'
import { log } from '../commons/log'
import { EstadoActivacionDAO } from '../dao/EstadoActivacion.DAO'
import { EventosEstadoActivacionDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { EventosEstadoActivacionService } from './EventosEstadoActivacion.Service'
import {
  ACTIVACION_EVENTOS_TIMETOLIVE,
  ESTADO_ACTIVACION_OTPGENERADO,
  ESTADO_ACTIVACION_BLOQUEADO,
  ESTADO_ACTIVACION_PROSPECTO,
  ACTIVACION_BLOQUEO_REINTENTOS
} from '../constants/constants'
import { NotFoundCliente } from '../commons/exceptions'

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
  if (toReturn.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO) {
    toReturn.expiraBloqueo = unixTimeStamp(toReturn.ultimaActualizacion, ACTIVACION_EVENTOS_TIMETOLIVE)
    toReturn.expiraBloqueoISO = new Date(toReturn.expiraBloqueo * 1000).toISOString()
  }
  if (toReturn.estadoActivacion === ESTADO_ACTIVACION_OTPGENERADO) toReturn.codigoOtp = activacion.codigoOtp
  log.info(`SERV: Terminando getEstadoActivacion ${toReturn}`)
  return toReturn
}

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
  if (codigoOtp !== undefined) activacion.codigoOtp = codigoOtp
  await EstadoActivacionDAO.setEstadoActivacion(idCliente, activacion)
  await EventosEstadoActivacionDAO.agregarEvento(activacion)
  log.info('SERV: Terminando setEstadoActivacion')
}

const getEstadoActivacionEvaluado = async idCliente => {
  log.info('SERV: Iniciando AuthOtp.evaluarBloqueo')
  // evaluando acciones
  const eventosParaBloqueo = await EventosEstadoActivacionService.countEventosForBloqueo(idCliente)
  const bloquearCliente = ACTIVACION_BLOQUEO_REINTENTOS - eventosParaBloqueo <= 0

  // evaluacion del estatus actual y cambiar el estatus a bloquado cuando no lo este
  let activacion = await getEstadoActivacion(idCliente)

  // evalua el desbloqueo de cuenta..
  if (!bloquearCliente && activacion.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO)
    await setEstadoActivacion(idCliente, ESTADO_ACTIVACION_PROSPECTO)

  // procedimientos cuando la cuenta necesita bloearse o se debe de encontrar debidamente bloqueada
  if (bloquearCliente && activacion.estadoActivacion !== ESTADO_ACTIVACION_BLOQUEADO)
    await setEstadoActivacion(idCliente, ESTADO_ACTIVACION_BLOQUEADO)

  activacion = await getEstadoActivacion(idCliente)
  // preparanto resultados a Retornar
  log.info('SERV: Terminando AuthOtp.evaluarBloqueo')
  return activacion
}

export const EstadoActivacionService = {
  getEstadoActivacion,
  setEstadoActivacion,
  getEstadoActivacionEvaluado
}
