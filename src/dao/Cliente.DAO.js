import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { PERPAGE } from '../commons/constants'
import { clienteSchema } from '../models/cliente.model'

const Cliente = Mongoose.model('cliente', clienteSchema)

const find = async idCliente => {}

const countIdCliente = async idCliente => {
  return await Cliente.find({ idCliente }).count()
}

const save = async cliente => {
  return await Cliente.create(cliente)
}

const findOneAndUpdate = async (idCliente, cliente) => {
  return await Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        idDevice: cliente.idDevice,
        tarjetaMonte: cliente.tarjetaMonte,
        nombreCliente: cliente.nombreCliente,
        apellidoPaterno: cliente.apellidoPaterno,
        apellidoMaterno: cliente.apellidoMaterno,
        correoCliente: cliente.correoCliente,
        celularCliente: cliente.celularCliente,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
}

export const ClienteDAO = {
  find,
  countIdCliente,
  save,
  findOneAndUpdate
}
