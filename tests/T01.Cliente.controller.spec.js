/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { actionCliente, TEST, MongoDB, CONTEXT } from './commons/cd-test-nmp'
import { SuiteTEST, IT } from './commons/cd-test'

SuiteTEST('T00','Cliente', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.actualizar(TEST.CLIENTE)
      await actionCliente.actualizar(TEST.CLIENTE_EXTRA)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo POST=> actualizarCliente
      IT.Post('T00A.0','actualizarCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/actualizarCliente`,
          body: TEST.CLIENTE_BODY,
          shoulHaveStatus: 201}})
      IT.Post('T00A.1','actualizarCliente, cuando el cliente NO EXISTE.')
      IT.Post('T00A.2','actualizarCliente, cuando el cliente SI EXISTE.')
      
      // Metodo GET => obtenerCliente
      IT.Get('T0B.0','obtenerCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
          defaultOptions: {
            listHeaders: TEST.LISTHEADER_OAG,
            url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/obtenerCliente`,
            shoulHaveStatus: 200,
            query: { idCliente: TEST.CLIENTE }}})
      IT.Get('T00B.2','obtenerCliente, cuando el cliente SI EXISTE.')
      IT.Get('T00B.1','obtenerCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE }})
      IT.Get('T00B.1','obtenerCliente, cuando no especifico el idCliente o un parametro no valido.', { shouldHaveStatus: 400, query: { Cliente: TEST.CLIENTE_NO_EXISTE } })
      

      // Metodo POST => remover cliente
      IT.Post('T00C.0','removerCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/removerCliente`,
          query: { idCliente: TEST.CLIENTE_EXTRA }
        }})
      IT.Post('T00C.1','removerCliente, cuando el cliente SI EXISTE.')
      IT.Post('T00C.2','removerCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404 })
}})
