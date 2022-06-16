import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'

const obtenerCliente = async idCliente => {
  LOG.info(`SERV: Starting obtenerCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  LOG.info(`SERV: Ending obtenerCliente method ${cliente}`)
  return cliente
}

const actualizarCliente = async body => {
  LOG.info('SERV: Starting actualizarCliente method')
  const { idCliente } = body
  const usuarioExist = await ClienteDAO.countIdCliente(idCliente)
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
    LOG.info(`SERV: cliente guardado ${idCliente}`)
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
  LOG.info('SERV: Ending actualizarCliente method')
  return resultSave
}

export const ClienteService = {
  actualizarCliente,
  obtenerCliente
}
