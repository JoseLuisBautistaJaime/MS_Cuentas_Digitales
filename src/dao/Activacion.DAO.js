import Mongoose from 'mongoose'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'

const Cliente = Mongoose.model('cliente', clienteSchema)

async function establecerEstatusActivacion(idCliente, estatusActivacion) {
  return Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        estatusActivacion,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
}

async function obtenerEstatusActivacion(idCliente) {
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  let result = {
    estatusActivacion: 0,
    estatusActivacionNombre: ''
  }
  if (cliente === null)
    result = {
      estatusActivacion: 1,
      estatusActivacionNombre: 'NoExisteCliente'
    }
  else {
    let { estatusActivacion } = cliente
    if (estatusActivacion === '' || estatusActivacion === undefined)
      estatusActivacion = 2
    switch (String(estatusActivacion)) {
      case '2':
        result = { estatusActivacion, estatusActivacionNombre: 'Prospecto' }
        break
      case (3, '3'):
        result = { estatusActivacion, estatusActivacionNombre: 'OtpGenerado' }
        break
      case (4, '4'):
        result = { estatusActivacion, estatusActivacionNombre: 'Activado' }
        break
      default:
    }
  }
  return result
}

export const ActivacionDAO = {
  establecerEstatusActivacion,
  obtenerEstatusActivacion
}

export default ActivacionDAO
