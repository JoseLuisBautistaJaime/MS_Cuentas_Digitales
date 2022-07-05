import LOG from '../commons/LOG'
import { convertirEstatusActivacionNombre } from '../models/clienteActivacion.model'
import { ActivacionDAO } from '../dao/clienteActivacion.DAO'
import { ActivacionEventoService } from './ActivacionEvento.Service'
// import { ACTIVACION_BLOQUEO_REINTENTOS, ACTIVACION_EVENTOS_TIMETOLIVE } from '../commons/constants'

// const evaluarDesBloqueo = async (idCliente, estatusActivacion) => {
//   LOG.info('SERV: Iniciando AuthOtp.evaluarDesBloqueo')
//   let activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
//   if (activacion.estatusActivacion === 5) {
//     const totalEventos = await ActivacionEventoService.listarEventos(idCliente, undefined, true)
//     if (totalEventos === 0) {
//       await clienteActivacionService.establecerEstatusActivacion(idCliente, 2)
//       activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
//     }
//   }
//   LOG.info('SERV: Terminar AuthOtp.evaluarDesBloqueo')
//   return activacion
// }

// const evaluarBloqueo = async (idCliente, estatusActivacion) => {
//   LOG.info('SERV: Iniciando AuthOtp.evaluarBloqueo')

//   // evaluando acciones
//   const totalEventos = await ActivacionEventoService.listarEventos(idCliente, estatusActivacion, true)
//   const reintentosDisponibles = ACTIVACION_BLOQUEO_REINTENTOS - totalEventos
//   const bloquearCliente = reintentosDisponibles <= 0

//   // evaluacion del estatus actual y cambiar el estatus a bloquado cuando no lo este
//   let activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
//   LOG.debugJSON('AuthOtp.evaluarBloqueo: activacion', activacion)

//   const toReturn = { code: 200 }

//   if (activacion.estatusActivacion === 5 && bloquearCliente === false) {
//     await clienteActivacionService.establecerEstatusActivacion(idCliente, 2)
//     activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
//   }

//   if (bloquearCliente) {
//     if (activacion.estatusActivacion !== 5) await clienteActivacionService.establecerEstatusActivacion(idCliente, 5)
//     activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
//     toReturn.code = 215

//     // toReturn.mensaje = 'Cuenta Bloqueada'
//     toReturn.expiraBloqueo = parseInt(
//       (activacion.ultimaActualizacion.getTime() + ACTIVACION_EVENTOS_TIMETOLIVE * 1000) / 1000,
//       10
//     )
//     toReturn.expiraBloqueoISO = new Date(toReturn.expiraBloqueo * 1000).toISOString()
//   }

//   toReturn.ultimaActualizacion = activacion.ultimaActualizacion
//   toReturn.estatusActivacion = activacion.estatusActivacion
//   toReturn.estatusActivacionNombre = activacion.estatusActivacionNombre

//   // preparanto resultados a Retornar
//   LOG.info('SERV: Terminando AuthOtp.evaluarBloqueo')
//   return toReturn
// }

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

// ** Inicio: getEstatusActivacion
async function obtenerEstatusActivacion(idCliente) {
  LOG.info('SERV: Iniciando obtenerEstatusActivacion')

  let activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)

  // evaluar desbloqueo de cuenta, en caso de estar bloqueada
  LOG.debug(`estatusActivacion ${activacion.estatusActivacion}`)
  if (activacion.estatusActivacion === 5) {
    const totalEventos = await ActivacionEventoService.listarEventos(idCliente, 5, true)
    LOG.debug(`totalEventos ${totalEventos}`)
    if (totalEventos === 0) {
      await establecerEstatusActivacion(idCliente, 2)
      activacion = await ActivacionDAO.obtenerEstatusActivacion(idCliente)
    }
  }

  // resultados finalies
  activacion.estatusActivacionNombre = convertirEstatusActivacionNombre(activacion.estatusActivacion)
  LOG.info('SERV: Terminando obtenerEstatusActivacion')
  return activacion
}

export const clienteActivacionService = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
export default clienteActivacionService
