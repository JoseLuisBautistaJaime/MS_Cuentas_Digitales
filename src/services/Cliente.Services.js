import Mongoose from 'mongoose'
import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'

const actualizarCliente = async body => {
  LOG.info('Internal: Starting actualizarUsuario method')
  const { idCliente } = body
  LOG.info(`ctrl: idCliente ${idCliente}`)
  const usuarioExist = await ClienteDAO.countIdCliente(idCliente)
  LOG.info(`prms:  usuarioExist ${usuarioExist}`)
  let resultSave
  if (usuarioExist === 0) {
    const clienteToAdd = {
      idCliente,
      idDevice: body.idDevice,
      tarjetaMonte: body.tarjetaMonte,
      nombreCliente: body.nombreCliente,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      correoCliente: body.correoCliente,
      celularCliente: body.celularCliente,
      estatusActivacion: 'prospecto',
      ultimaActualizacion: Date.now()
    }
    resultSave = await ClienteDAO.save(clienteToAdd)
    LOG.info(`ctrl: cliente guardado ${idCliente}`)
  } else {
    const clienteUpdate = {
      idDevice: body.idDevice,
      tarjetaMonte: body.tarjetaMonte,
      nombreCliente: body.nombreCliente,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      correoCliente: body.correoCliente,
      celularCliente: body.celularCliente,
      estatusActivacion: 'prospecto'
    }
    resultSave = await ClienteDAO.findOneAndUpdate(idCliente, clienteUpdate)
  }
  return resultSave
}

export const ClienteService = {
  actualizarCliente
}
