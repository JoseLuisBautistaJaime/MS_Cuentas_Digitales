import { log } from '../commons/log'
import { ActivacionEventoDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/exceptions'

async function listarEventos(idCliente, estadoActivacion, soloContar) {
  log.info(`SERV: Iniciando ActivacionEventoService.listarEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await ActivacionEventoDAO.listarEventos(idCliente, estadoActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  log.info(`SERV: Terminando ActivacionEventoService.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estadoActivacion) {
  await ActivacionEventoDAO.removerEventos(idCliente, estadoActivacion)
  log.debug(`ActivacionEventoService.removerEventos`)
}

export const ActivacionEventoService = {
  listarEventos,
  removerEventos
}
