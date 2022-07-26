/* eslint-disable prettier/prettier */
import nock from 'nock'
import { actionCliente, TEST, MongoDB, CONTEXT } from './commons/pi8-test-nmp'
import { SuiteTEST, IT, RootTEST } from './commons/pi8-test'

// RootTEST('T4','Cliente.controller','Bloque de test para el dominio Cliente', {
//   after: async () => { 
//     await MongoDB.connect()
//     await actionCliente.eliminar(TEST.CLIENTE)}, 
//   before: async () => { 
//     await MongoDB.disconnect()},
//   tests: async () => { 
    // Test para Actualizar Clientes
    SuiteTEST('T4A','actualizarCliente', {
        listHeaders: TEST.LISTHEADER_OAG,
        url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/actualizarCliente`,
        body: TEST.CLIENTE_BODY,
        shouldHaveStatus: 201,
        testIgnore: false },{
      after: async () => { 
        await MongoDB.connect()
        await actionCliente.eliminar(TEST.CLIENTE)}, 
      before: async () => { 
        await MongoDB.disconnect()},          
      tests: async (key) => { // seccion de TESTS
        await IT.Post('T4A.0','actualizarCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
        await IT.Post('T4A.1','actualizarCliente, cuando el cliente NO EXISTE.', { testIgnore: false })
        await IT.Post('T4A.2','actualizarCliente, cuando el cliente SI EXISTE.', { testIgnore: false })
        }})

//     // Test para Obtener Clientes
//     await SuiteTEST('T4B','obtenerCliente', {
//         listHeaders: TEST.LISTHEADER_OAG,
//         url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/obtenerCliente`,
//         query: { idCliente: TEST.CLIENTE },
//         shoulHaveStatus: 200 },{ 
//       after: async () => { 
//         await actionCliente.eliminar(TEST.CLIENTE)}, 
//       tests: async () => { // seccion de TESTS
//         IT.Get('T4B.0','obtenerCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: []})
//         IT.Get('T4B.1','obtenerCliente, cuando el cliente NO EXISTE.', { testIgnore: true, shouldHaveStatus: 404 })
//         IT.Get('T4B.2','obtenerCliente, cuando el cliente SI EXISTE.', 
//           { testIgnore: true, shouldHaveStatus: 200 },
//           { after: async () => actionCliente.reiniciar(TEST.CLIENTE)})}})
// }})