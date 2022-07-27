/* eslint-disable prettier/prettier */
import nock from 'nock'
import { actionCliente, TEST, MongoDB, CONTEXT } from './commons/pi8-test-nmp'
import { SuiteTEST, IT } from './commons/pi8-test'
import { delay } from 'lodash'

// SuiteTEST('TA','XX',{},{
//   tests: async () => {
  
  SuiteTEST('T4A','actualizarCliente', { // Default Options
    listHeaders: TEST.LISTHEADER_OAG,
    url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/actualizarCliente`,
    body: TEST.CLIENTE_BODY,
    shoulHaveStatus: 201,
    testIgnore: false
  }, { // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.eliminar(TEST.CLIENTE)},
    after: async () => { 
      MongoDB.disconnect()}, 
    tests: async () => { // seccion de TESTS
      IT.Post('T4A.0','actualizarCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
      IT.Post('T4A.1','actualizarCliente, cuando el cliente NO EXISTE.', { testIgnore: false })
      IT.Post('T4A.2','actualizarCliente, cuando el cliente SI EXISTE.', { testIgnore: false })}})
      

// SuiteTEST('T4B','obtenerCliente', {
//   listHeaders: TEST.LISTHEADER_OAG,
//   url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/obtenerCliente`,
//   query: { idCliente: TEST.CLIENTE },
//   shoulHaveStatus: 200,
//   testIgnore: true 
//   },{ 
//     after: async () => { 
//       await actionCliente.eliminar(TEST.CLIENTE)}, 
//     tests: async () => { // seccion de TESTS
//         IT.Get('T4B.0','obtenerCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
//         IT.Get('T4B.1','obtenerCliente, cuando el cliente NO EXISTE.', { testIgnore: true, shouldHaveStatus: 404 })
//         IT.Get('T4B.2','obtenerCliente, cuando el cliente SI EXISTE.', { testIgnore: true, shouldHaveStatus: 200 },
//           { after: async () => actionCliente.reiniciar(TEST.CLIENTE)})}})



// }})
