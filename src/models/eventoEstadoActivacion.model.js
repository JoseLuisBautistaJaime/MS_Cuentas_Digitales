import mongoose from 'mongoose'

export const eventoEstadoActivacionSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String
})
