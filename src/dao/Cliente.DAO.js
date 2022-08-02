import Mongoose from 'mongoose'
import { clienteSchema } from '../models/cliente.model'

const Cliente = Mongoose.model('cliente', clienteSchema)
const findByIdCliente = async idCliente => Cliente.findOne({ idCliente })
const save = async cliente => Cliente.create(cliente)
const remover = async idCliente => Cliente.remove({ idCliente })

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
  remover,
  save,
  findOneAndUpdate
}
