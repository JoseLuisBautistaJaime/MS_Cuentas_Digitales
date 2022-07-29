import mongoose from 'mongoose'

export const eventoEstadoActivacionSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
  estadoActivacion: Number,
  estadoActivacionNombre: String,
  codigoOtp: String
})
