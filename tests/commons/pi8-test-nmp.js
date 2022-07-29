/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import MongodbMemoryServer from 'mongodb-memory-server'
import { createConnection } from '../../src/commons/connection'
import { ClienteService } from '../../src/services/Cliente.Service'
import { log } from '../../src/commons/pi8-log'
import { ActivacionEventoService } from '../../src/services/ActivacionEvento.Service'
import { ClienteActivacionService } from '../../src/services/ClienteActivacion.Service'
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
    // await mongo.disconnect()
    // await server.stop()
  }
}

// SECCION 2. CONSTANTES PARA TEST
export const TEST_CLIENTE = '9991'
export const TEST = {
  CLIENTE: TEST_CLIENTE,
  CLIENTE_NO_EXISTE: '9990',
  CLIENTE_PARA_REMOVER: '9995',
  CLIENTE_EXTRA: '8888',
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
    log.fatal('iniciando-reiniciarCliente')
    const body = TEST.CLIENTE_BODY
    body.idCliente = idCliente
    await ClienteService.actualizarCliente(body)
    await ActivacionEventoService.removerEventos(idCliente)
    await ClienteActivacionService.establecerEstatusActivacion(idCliente, 2, '0000')
    log.fatal('terminando-reiniciarCliente')
  },
  actualizar: async idCliente => {
    const body = TEST.CLIENTE_BODY
    body.idCliente = idCliente
    await ClienteService.actualizarCliente(body)
  },
  bloquearConEnvios: async idCliente => {
    await ActivacionEventoService.removerEventos(idCliente)
    for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i++) {
      await ClienteActivacionService.establecerEstatusActivacion(idCliente, 3, '0000')
    }
  },
  bloquearSinEventos: async idCliente => {
    await ActivacionEventoService.removerEventos(idCliente)
    await ClienteActivacionService.establecerEstatusActivacion(idCliente, 5)
  }
}

export const bloquearClienteSinEventos = async tag => {
  log.debug(tag)
  await ClienteActivacionService.establecerEstatusActivacion(TEST.CLIENTE, 5)
  await ActivacionEventoService.removerEventos(TEST.CLIENTE)
}
