/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { ClienteService } from '../../src/services/Cliente.Service'
import { ACTIVACION_BLOQUEO_REINTENTOS } from '../../src/commons/constants'
import { LOG } from '../../src/commons'
import { TEST_CLIENTE, TEST_CLIENTE_DATA } from './pi8-test-nmp-constants'
import { ActivacionEventoService } from '../../src/services/ActivacionEvento.Service'
import { clienteActivacionService } from '../../src/services/clienteActivacion.Service'

export const reiniciarCliente = async tag => {
  LOG.debug(tag)
  await ClienteService.removerCliente(TEST_CLIENTE)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  await ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
}

export const bloquearClienteConEnviosOtp = async tag => {
  LOG.debug(tag)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i++) {
    await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 3, '0000')
  }
}

export const bloquearClienteSinEventos = async tag => {
  LOG.debug(tag)
  await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 5)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
}

export const testHelpers = {
  reiniciarCliente,
  bloquearClienteConEnviosOtp,
  bloquearClienteSinEventos
}
