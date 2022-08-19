import { log } from '../commons/log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { EstadoActivacionService } from './EstadoActivacion.Service'
import { NotFoundCliente } from '../commons/exceptions'
import { ESTADO_ACTIVACION_PROSPECTO } from '../constants/constants'


/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna el contenido de documento cliente.
 */
const deleteCliente = async idCliente => {
  log.info('SERV: Iniciando deleteCliente')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  await ClienteDAO.remover(idCliente)
  log.info(`SERV: Terminando deleteCliente`)
  return { message: `El cliente (${cliente.idCliente}) ha sido eliminado.` }
}

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna el contenido de documento cliente.
 */
const getCliente = async idCliente => {
  log.info(`SERV: Iniciando getCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })
  log.info(`SERV: Terminando getCliente`)
  return cliente
}

/**
 * Efecutua la actualización de los datos personales del cliente, en caso de no existir el cliente, este es creado, en caso contrario es solamente actualizado.
 * @param {*} body contiene el 'idCliente' y otra serie de parametros de datos personales dentro del body.
 * @returns Status 200, si la actualizacion se llevo a cabo con exito.
 */
const setCliente = async (idCliente, body) => {
  log.info(`SERV: Iniciando setCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  const clienteToSave = {
    idCliente,
    idDevice: body.idDevice,
    tarjetaMonte: body.tarjetaMonte,
    nombreCliente: body.nombreCliente,
    apellidoPaterno: body.apellidoPaterno,
    apellidoMaterno: body.apellidoMaterno,
    correoCliente: body.correoCliente,
    celularCliente: body.celularCliente
  }
  if (cliente === null) {
    await ClienteDAO.save(clienteToSave)
    await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_PROSPECTO)
  } else await ClienteDAO.findOneAndUpdate(idCliente, clienteToSave)
  log.info('SERV: Terminando setCliente')
}

export const ClienteService = {
  setCliente,
  getCliente,
  deleteCliente
}
