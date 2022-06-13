import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'

const getCliente = async idCliente => {
  LOG.info(`Cliente.Service.getCliente: P5 ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  LOG.info(`Cliente.Service.getCliente: P6 ${cliente}`)
  return cliente
}

const actualizarCliente = async body => {
  LOG.info('SERV: Starting actualizarCliente method')
  const { idCliente } = body
  LOG.info(`SERV: idCliente ${idCliente}`)
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
  getCliente
}
