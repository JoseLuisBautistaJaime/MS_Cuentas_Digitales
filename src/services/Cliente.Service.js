import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ActivacionService } from './Activacion.Service'

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna todo el contenido de documento cliente.
 */
const obtenerCliente = async idCliente => {
  LOG.info(`SERV: Starting obtenerCliente ${idCliente}`)
  LOG.debugJSON('SERV[obtenerCliente]-idCliente', idCliente)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  LOG.debugJSON('SERV[obtenerCliente]-cliente', cliente)
  LOG.info(`SERV: Ending obtenerCliente method ${cliente}`)
  return cliente
}

/**
 * Efecutua la actualización de los datos personales del cliente, en caso de no existir el cliente, este es creado, en caso contrario es solamente actualizado.
 * @param {*} body contiene el 'idCliente' y otra serie de parametros de datos personales dentro del body.
 * @returns Status 200, si la actualizacion se llevo a cabo con exito.
 */
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
      celularCliente: body.celularCliente
    }
    resultSave = await ClienteDAO.save(clienteToAdd)
    ActivacionService.establecerEstatusActivacion(idCliente, 2)
    LOG.info(`SERV: cliente guardado ${idCliente}`)
  } else {
    const clienteUpdate = {
      idDevice: body.idDevice,
      tarjetaMonte: body.tarjetaMonte,
      nombreCliente: body.nombreCliente,
      apellidoPaterno: body.apellidoPaterno,
      apellidoMaterno: body.apellidoMaterno,
      correoCliente: body.correoCliente,
      celularCliente: body.celularCliente
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
