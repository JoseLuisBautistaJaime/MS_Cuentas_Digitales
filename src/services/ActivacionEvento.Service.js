import LOG from '../commons/LOG'
import { ActivacionEventoDAO } from '../dao/ActivacionEvento.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { NotFoundCliente } from '../commons/pi8-controller-exceptions'

async function listarEventos(idCliente, estatusActivacion, soloContar) {
  LOG.info(`SERV: Iniciando ActivacionEventoService.listarEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) throw new NotFoundCliente({ message: `No se encontro el cliente ${idCliente}.` })

  let toReturn = await ActivacionEventoDAO.listarEventos(idCliente, estatusActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  LOG.info(`SERV: Terminando ActivacionEventoService.listarEventos`)
  return toReturn
}

async function removerEventos(idCliente, estatusActivacion) {
  await ActivacionEventoDAO.removerEventos(idCliente, estatusActivacion)
  LOG.debug(`ActivacionEventoService.removerEventos`)
}

export const ActivacionEventoService = {
  listarEventos,
  removerEventos
}
