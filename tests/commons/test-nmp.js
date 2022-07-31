/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import MongodbMemoryServer from 'mongodb-memory-server'
import { createConnection } from '../../src/commons/connection'
import { ClienteService } from '../../src/services/Cliente.Service'
import { log } from '../../src/commons/log'
import { EventosEstadoActivacionService } from '../../src/services/EventosEstadoActivacion.Service'
import { EstadoActivacionService } from '../../src/services/EstadoActivacion.Service'
import { CONTEXT_NAME, CONTEXT_VERSION, ACTIVACION_BLOQUEO_REINTENTOS, URL_API_COMUNICACIONES } from '../../src/constants/constants'

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
  URL_API_COMUNICACIONES,
  CLIENTE: TEST_CLIENTE,
  CLIENTE_NO_EXISTE: '9990',
  CLIENTE_PARA_REMOVER: '9995',
  CLIENTE_EXTRA: '8888',
  CLIENTE_BODY: {
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
    await ClienteService.deleteCliente(idCliente)
    await EventosEstadoActivacionService.deleteEventos(idCliente)
  },
  reiniciar: async idCliente => {
    log.fatal('iniciando-reiniciarCliente')
    await ClienteService.setCliente(idCliente, TEST.CLIENTE_BODY)
    await EventosEstadoActivacionService.deleteEventos(idCliente)
    await EstadoActivacionService.setEstadoActivacion(idCliente, 2, '0000')
    log.fatal('terminando-reiniciarCliente')
  },
  actualizar: async idCliente => ClienteService.setCliente(idCliente, TEST.CLIENTE_BODY),
  bloquearConEnvios: async idCliente => {
    await EventosEstadoActivacionService.deleteEventos(idCliente)
    for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i++) {
      await EstadoActivacionService.setEstadoActivacion(idCliente, 3, '0000')
    }
  },
  bloquearSinEventos: async idCliente => {
    await EventosEstadoActivacionService.deleteEventos(idCliente)
    await EstadoActivacionService.setEstadoActivacion(idCliente, 5)
  }
}
