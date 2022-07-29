import { log } from '../commons/pi8-log'
import { ActivacionEventoDAO } from '../dao/ActivacionEvento.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/pi8-controller-exceptions'

async function listarEventos(idCliente, estatusActivacion, soloContar) {
  log.info(`SERV: Iniciando ActivacionEventoService.listarEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await ActivacionEventoDAO.listarEventos(idCliente, estatusActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  log.info(`SERV: Terminando ActivacionEventoService.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  await ActivacionEventoDAO.removerEventos(idCliente, estatusActivacion)
  log.debug(`ActivacionEventoService.removerEventos`)
}

export const ActivacionEventoService = {
  listarEventos,
  removerEventos
}
