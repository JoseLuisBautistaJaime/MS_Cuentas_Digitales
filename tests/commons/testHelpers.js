/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { ActivacionEventoService } from '../../src/services/ActivacionEvento.Service'
import { clienteActivacionService } from '../../src/services/clienteActivacion.Service'
import { ClienteService } from '../../src/services/Cliente.Service'
import { ACTIVACION_BLOQUEO_REINTENTOS } from '../../src/commons/constants'
import { LOG } from '../../src/commons'

export const HEADER = {
  AUTHORIZATION: 'Basic zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz=',
  IDCONSUMIDOR: 99,
  IDDESTINO: 99,
  USUARIO: 'test',
  AUTHBEARER: 'xxxxxxxxxxxx='
}

export const TEST_CLIENTE = '9999'
export const TEST_CLIENTE_DATA = {
  idCliente: TEST_CLIENTE,
  idDevice: '74312734d5403d54',
  tarjetaMonte: '11111',
  nombreCliente: 'ricoff',
  apellidoPaterno: 'CARRILLO',
  apellidoMaterno: 'LOPEZF',
  correoCliente: 'rigocl@hotmail.com',
  celularCliente: '6731143889'
}

const reiniciarCliente = async tag => {
  LOG.debug(tag)
  await ClienteService.removerCliente(TEST_CLIENTE)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  await ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
}

const bloquearClienteConEnviosOtp = async tag => {
  LOG.debug(tag)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i++) {
    await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 3, '0000')
  }
}

const bloquearClienteSinEventos = async tag => {
  LOG.debug(tag)
  await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 5)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
}

export const testHelpers = {
  reiniciarCliente,
  bloquearClienteConEnviosOtp,
  bloquearClienteSinEventos,
  TEST_CLIENTE,
  TEST_CLIENTE_DATA
}
