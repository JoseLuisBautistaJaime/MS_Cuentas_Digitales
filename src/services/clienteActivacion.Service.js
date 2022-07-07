import LOG from '../commons/LOG'
import { ActivacionDAO } from '../dao/clienteActivacion.DAO'
import { ActivacionEventoService } from './ActivacionEvento.Service'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from '../commons/constants'
import { Util } from '../commons/utils'

/**
 * SERV: Establece el estatus de actuvacion.
 * @param {*} idCliente el número idCliente.
 * @param {*} estatusActivacion El número del estatus de Activacion.
 */
async function establecerEstatusActivacion(idCliente, estatusActivacion, codigoOtp) {
  LOG.info('SERV: Iniciando establecerEstatusActivacion')
  const activacion = {
    idCliente,
    estatusActivacion,
    estatusActivacionNombre: ActivacionDAO.convertirEstatusActivacionNombre(estatusActivacion),
    ultimaActualizacion: Date.now()
  }
  if (codigoOtp !== undefined) activacion.codigoOtp = codigoOtp
  await ActivacionDAO.establecerEstatusActivacion(idCliente, activacion)
  LOG.info('SERV: Terminando establecerEstatusActivacion')
  // eslint-disable-next-line no-use-before-define
  return obtenerEstatusActivacion(idCliente, false)
}

// ** Inicio: getEstatusActivacion
async function obtenerEstatusActivacion(idCliente, evaluarDesbloqueo) {
  LOG.info('SERV: Iniciando obtenerEstatusActivacion')

  let activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)

  // evaluar desbloqueo de cuenta, en caso de estar bloqueada
  LOG.debug(`estatusActivacion ${activacion.estatusActivacion}`)
  if (evaluarDesbloqueo === undefined || evaluarDesbloqueo === true) {
    if (activacion.estatusActivacion === 5) {
      const totalEventos = await ActivacionEventoService.listarEventos(idCliente, 5, true)
      LOG.debug(`totalEventos ${totalEventos}`)
      if (totalEventos === 0) {
        await establecerEstatusActivacion(idCliente, 2)
        activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
      }
    }
  }

  // Conversion de valores generales
  const toReturn = {}
  toReturn.code = activacion.estatusActivacion === 5 ? 215 : 200
  toReturn.code = activacion.estatusActivacion === 1 ? 400 : toReturn.code
  toReturn.estatusActivacion = activacion.estatusActivacion
  toReturn.estatusActivacionNombre = activacion.estatusActivacionNombre

  //  Conversion de valores especializados
  if (toReturn.estatusActivacion >= 2) toReturn.ultimaActualizacion = activacion.ultimaActualizacion
  if (toReturn.estatusActivacion === 5) {
    toReturn.expiraBloqueo = Util.unixTimeStamp(toReturn.ultimaActualizacion, ACTIVACION_EVENTOS_TIMETOLIVE)
    toReturn.expiraBloqueoISO = new Date(toReturn.expiraBloqueo * 1000).toISOString()
  }
  if (toReturn.estatusActivacion === 3) toReturn.codigoOtp = activacion.codigoOtp
  LOG.info(`SERV: Terminando obtenerEstatusActivacion ${toReturn.code}`)
  return toReturn
}

export const clienteActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
export default clienteActivacionService
