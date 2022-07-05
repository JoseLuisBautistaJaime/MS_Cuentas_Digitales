import LOG from '../commons/LOG'
import { convertirEstatusActivacionNombre } from '../models/clienteActivacion.model'
import { ActivacionDAO } from '../dao/clienteActivacion.DAO'

// ** Inicio: getEstatusActivacion
async function obtenerEstatusActivacion(idCliente) {
  LOG.info('SERV: Iniciando obtenerEstatusActivacion')
  const toReturn = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
  toReturn.estatusActivacionNombre = convertirEstatusActivacionNombre(toReturn.estatusActivacion)
  LOG.info('SERV: Terminando obtenerEstatusActivacion')
  return toReturn
}

/**
 * SERV: Establece el estatus de actuvacion.
 * @param {*} idCliente el número idCliente.
 * @param {*} estatusActivacion El número del estatus de Activacion.
 */
async function establecerEstatusActivacion(idCliente, estatusActivacion) {
  LOG.info('SERV: Iniciando establecerEstatusActivacion')
  const activacion = {
    idCliente,
    estatusActivacion,
    estatusActivacionNombre: convertirEstatusActivacionNombre(estatusActivacion),
    ultimaActualizacion: Date.now()
  }
  await ActivacionDAO.establecerEstatusActivacion(idCliente, activacion)
  LOG.info('SERV: Terminando establecerEstatusActivacion')
}

export const clienteActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
export default clienteActivacionService
