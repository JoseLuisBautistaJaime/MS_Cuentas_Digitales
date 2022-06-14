import mongoose from 'mongoose'

export const clienteSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  idDevice: { type: String, required: true },
  tarjetaMonte: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  nombreCompleto: String,
  correoCliente: String,
  celularCliente: String,
  statusActivacion: { Type: Number },
  activacion: Object,
  codigoVerificacion: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})
