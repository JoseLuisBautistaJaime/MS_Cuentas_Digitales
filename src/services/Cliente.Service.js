import LOG from '../commons/LOG'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { clienteActivacionService } from './clienteActivacion.Service'
import { NotFoundCliente } from '../commons/pi8-controller-exceptions'
// import { OAuthService } from './OAuth.Service'

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna todo el contenido de documento cliente.
 */
const removerCliente = async idCliente => {
  LOG.info('SERV: Iniciando removerCliente')
  await ClienteDAO.remover(idCliente)
  LOG.info(`SERV: Terminando removerCliente`)
  return true
}

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna todo el contenido de documento cliente.
 */
const obtenerCliente = async idCliente => {
  LOG.info(`SERV: Iniciando obtenerCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}`})
  LOG.info(`SERV: Terminando obtenerCliente`)
  return cliente
}

/**
 * Efecutua la actualización de los datos personales del cliente, en caso de no existir el cliente, este es creado, en caso contrario es solamente actualizado.
 * @param {*} body contiene el 'idCliente' y otra serie de parametros de datos personales dentro del body.
 * @returns Status 200, si la actualizacion se llevo a cabo con exito.
 */
const actualizarCliente = async body => {
  LOG.info('SERV: Iniciando actualizarCliente')
  const { idCliente } = body
  const usuarioExist = await ClienteDAO.countIdCliente(idCliente)
  LOG.debug(`usuarioExist ${usuarioExist}`)
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
    clienteActivacionService.establecerEstatusActivacion(idCliente, 2)
    LOG.debug(`actualizarCliente-Cliente guardado ${idCliente}`)
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
  LOG.debug(`resultSave ${resultSave}`)
  LOG.info('SERV: Terminando actualizarCliente')
  return resultSave
}

export const ClienteService = {
  actualizarCliente,
  obtenerCliente,
  removerCliente
}
