import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'

const Cliente = Mongoose.model('cliente', clienteSchema)

async function setStatusActivacion(idCliente, statusActivacion) {
  const resultSave = await Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        statusActivacion,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
  return resultSave
}

async function getStatusActivacion(idCliente) {
  const cliente = await ClienteDAO.findByIdCliente(idCliente)

  let result = {
    statusActivacion: 0,
    statusActivacionName: ''
  }
  if (cliente === null)
    result = { statusActivacion: 1, statusActivacionName: 'NoExisteCliente' }
  else {
    let { statusActivacion } = cliente
    if (statusActivacion === '' || statusActivacion === undefined)
      statusActivacion = 2
    switch (String(statusActivacion)) {
      case '2':
        result = { statusActivacion, statusActivacionName: 'Prospecto' }
        break
      case (3, '3'):
        result = { statusActivacion, statusActivacionName: 'OtpGenerado' }
        break
      case (4, '4'):
        result = { statusActivacion, statusActivacionName: 'Activado' }
        break
      default:
    }
  }
  return result
}

export const ActivacionDAO = {
  setStatusActivacion,
  getStatusActivacion
}

export default ActivacionDAO
