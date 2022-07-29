import mongoose from 'mongoose'

export const estadoActivacionSchema = new mongoose.Schema({
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})
