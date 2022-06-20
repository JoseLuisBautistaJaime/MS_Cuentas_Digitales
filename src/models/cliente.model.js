import mongoose from 'mongoose'

export const clienteActivacionLogEventsSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String
})

export const clienteActivacionSchema = new mongoose.Schema({
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})

export const clienteSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  idCliente: { type: String, index: true, required: true },
  idDevice: { type: String, required: true },
  tarjetaMonte: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  nombreCompleto: String,
  correoCliente: String,
  celularCliente: String,
  activacion: clienteActivacionSchema,
  activacionLogEvents: [clienteActivacionLogEventsSchema]
})
