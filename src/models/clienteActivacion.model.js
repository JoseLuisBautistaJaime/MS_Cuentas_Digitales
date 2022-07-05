import mongoose from 'mongoose'

export const clienteActivacionSchema = new mongoose.Schema({
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})

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
