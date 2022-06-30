import Mongoose from 'mongoose'
import { clienteSchema } from '../models/cliente.model'

const Cliente = Mongoose.model('cliente', clienteSchema)

const findByIdCliente = async idCliente => {
  return Cliente.findOne({ idCliente })
}

const countIdCliente = async idCliente => {
  return Cliente.find({ idCliente }).count()
}

const save = async cliente => {
  return Cliente.create(cliente)
}
const remover = async idCliente => {
  return Cliente.remove({
    idCliente
  })
}

const findOneAndUpdate = async (idCliente, cliente) => {
  return Cliente.findOneAndUpdate(
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
  findByIdCliente,
  countIdCliente,
  remover,
  save,
  findOneAndUpdate
}
