import mongoose from 'mongoose'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from '../commons/constants'

export const activacionEventoSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: ACTIVACION_EVENTOS_TIMETOLIVE
  },
  estatusActivacion: Number,
  estatusActivacionNombre: String,
  codigoOtp: String
})
