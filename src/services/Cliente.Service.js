import { log } from '../commons/pi8-controller-log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { ClienteActivacionService } from './ClienteActivacion.Service'
import { NotFoundCliente } from '../commons/pi8-controller-exceptions'
// import { OAuthService } from './OAuth.Service'

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna todo el contenido de documento cliente.
 */
const removerCliente = async idCliente => {
  log.info('SERV: Iniciando removerCliente')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  await ClienteDAO.remover(idCliente)
  log.info(`SERV: Terminando removerCliente`)
  return cliente
}

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna todo el contenido de documento cliente.
 */
const obtenerCliente = async idCliente => {
  log.info(`SERV: Iniciando obtenerCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  log.info(`SERV: Terminando obtenerCliente`)
  return cliente
}

/**
 * Efecutua la actualización de los datos personales del cliente, en caso de no existir el cliente, este es creado, en caso contrario es solamente actualizado.
 * @param {*} body contiene el 'idCliente' y otra serie de parametros de datos personales dentro del body.
 * @returns Status 200, si la actualizacion se llevo a cabo con exito.
 */
const actualizarCliente = async body => {
  log.info('SERV: Iniciando actualizarCliente')
  let resultSave
  const { idCliente } = body
  const usuarioExist = await ClienteDAO.countIdCliente(idCliente)
  log.debug(`usuarioExist ${usuarioExist}`)

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
    await ClienteActivacionService.establecerEstatusActivacion(idCliente, 2)
    log.debug(`actualizarCliente-Cliente guardado ${idCliente}`)
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
  log.debug(`resultSave ${resultSave}`)
  log.info('SERV: Terminando actualizarCliente')
  return resultSave
}

export const ClienteService = {
  actualizarCliente,
  obtenerCliente,
  removerCliente
}
