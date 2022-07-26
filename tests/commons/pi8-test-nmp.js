/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import MongodbMemoryServer from 'mongodb-memory-server'
import { createConnection } from '../../src/commons/connection'
import { ClienteService } from '../../src/services/Cliente.Service'
import { LOG } from '../../src/commons'
import { ActivacionEventoService } from '../../src/services/ActivacionEvento.Service'
import { clienteActivacionService } from '../../src/services/clienteActivacion.Service'
import { CONTEXT_NAME, CONTEXT_VERSION, ACTIVACION_BLOQUEO_REINTENTOS } from '../../src/commons/constants'

// SECCION 1. CONSTAONTES DE CONTEXTO
export const CONTEXT = {
  NAME: CONTEXT_NAME,
  VERSION: CONTEXT_VERSION
}

// SECCION 2. CONECIONES A MONBODB
let mongo
let server

export const MongoDB = {
  connect: async () => {
    server = new MongodbMemoryServer()
    process.env.URI = await server.getConnectionString()
    console.log(`Instancia de BD: ${process.env.URI}`)
    mongo = await createConnection()
  },
  disconnect: async () => {
    // mongo.close()
    // server.stop()
  }
}

// SECCION 2. CONSTANTES PARA TEST
export const TEST_CLIENTE = '9999'
export const TEST = {
  CLIENTE: TEST_CLIENTE,
  CLIENTE_BODY: {
    idCliente: TEST_CLIENTE,
    idDevice: '74312734d5403d54',
    tarjetaMonte: '11111',
    nombreCliente: 'ricoff',
    apellidoPaterno: 'CARRILLO',
    apellidoMaterno: 'LOPEZF',
    correoCliente: 'rigocl@hotmail.com',
    celularCliente: '6731143889'
  },
  LISTHEADER_OAG: [
    { name: 'Authorization', value: 'Basic zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz=' },
    { name: 'oauth.bearer', value: 'xxxxxxxxxxxx=' },
    { name: 'idConsumidor', value: 99 },
    { name: 'idDestino', value: 99 },
    { name: 'usuario', value: 'test' }
  ]
}

// Acciones de CLIENTE
export const actionCliente = {
  eliminar: async idCliente => {
    await ClienteService.removerCliente(idCliente)
    await ActivacionEventoService.removerEventos(idCliente)
  },
  reiniciar: async idCliente => {
    actionCliente.eliminar(idCliente)
    await ClienteService.actualizarCliente(TEST.CLIENTE_BODY)
  }
}

export const bloquearClienteConEnviosOtp = async tag => {
  LOG.debug(tag)
  await ActivacionEventoService.removerEventos(TEST.CLIENTE)
  for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i++) {
    await clienteActivacionService.establecerEstatusActivacion(TEST.CLIENTE, 3, '0000')
  }
}

export const bloquearClienteSinEventos = async tag => {
  LOG.debug(tag)
  await clienteActivacionService.establecerEstatusActivacion(TEST.CLIENTE, 5)
  await ActivacionEventoService.removerEventos(TEST.CLIENTE)
}

export const actionsCliente = {
  bloquearClienteConEnviosOtp,
  bloquearClienteSinEventos
}
