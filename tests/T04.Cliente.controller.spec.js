/* eslint-disable prettier/prettier */
import nock from 'nock'
import { actionCliente, TEST, MongoDB, CONTEXT } from './commons/pi8-test-nmp'
import { SuiteTEST, IT } from './commons/pi8-test'

SuiteTEST('T4A','actualizarCliente', 
  { // Default Options
    listHeaders: TEST.LISTHEADER_OAG,
    url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/actualizarCliente`,
    body: TEST.CLIENTE_BODY,
    shoulHaveStatus: 201,
    testIgnore: false
  },
  { // callbakcs
    after: async () => { 
      await MongoDB.connect()
      await actionCliente.eliminar(TEST.CLIENTE)
    }, 
    before: () => { 
      MongoDB.disconnect()
    },
    tests: async () => { // seccion de TESTS
      IT.Post('T4A.0','actualizarCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
      IT.Post('T4A.1','actualizarCliente, cuando el cliente NO EXISTE.', { testIgnore: false })
      IT.Post('T4A.2','actualizarCliente, cuando el cliente SI EXISTE.', { testIgnore: false })
    }
  }
) 

// SuiteTEST('T4B','obtenerCliente', 
//   { // Opciones a default
//     defaultListHeaders : TEST.LISTHEADER_OAG,
//     defaultUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/obtenerCliente`,
//     defaultQuery: {idCliente:TEST.CLIENTE},
//     defaultShouldHaveStatus: 200
//   }, 
  
//   async () => { // seccion de BEFORE
//     await MongoDB.connect()
//     await actionClienteEliminar(TEST.CLIENTE)
//   }, 
  
//   async () => { // seccion de AFTER_SuiteTEST
//     await MongoDB.disconnect()
//   }, 
  
//   async () => { // seccion de TESTS
//     itGET('T4A.0','obtenerCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
//     itGET('T4A.1','obtenerCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404 })
//     itGET('T4A.2','obtenerCliente, cuando el cliente SI EXISTE.')
// }) 