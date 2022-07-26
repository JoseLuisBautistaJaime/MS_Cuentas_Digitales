/* eslint-disable prettier/prettier */
import nock from 'nock'
import { actionClienteEliminar, TEST, MongoDB, CONTEXT } from './commons/pi8-test-nmp'

// mocha-test
import { SuiteTEST, itPOST } from './commons/pi8-test'

SuiteTEST('T4A','actualizarCliente', 
 // Opciones a default
  {
    defaultListHeaders : TEST.LISTHEADER_OAG,
    defaultUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/actualizarCliente`,
    defaultBody: TEST.CLIENTE_BODY,
    defaultShouldHaveStatus: 201
  }, 
  
  async () => { // seccion de BEFORE
    await MongoDB.connect()
    await actionClienteEliminar(TEST.CLIENTE)
  }, 
  
  async () => { // seccion de AFTER_SuiteTEST
    // await MongoDB.disconnect()
  }, 
  
  async () => { // seccion de TESTS
    itPOST('T4A.0','actualizarCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
    itPOST('T4A.1','actualizarCliente, cuando el cliente NO EXISTE.')
    itPOST('T4A.2','actualizarCliente, cuando el cliente SI EXISTE.')
}) 

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