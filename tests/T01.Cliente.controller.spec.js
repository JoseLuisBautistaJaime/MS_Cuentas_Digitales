/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { actionCliente, TEST, MongoDB, CONTEXT } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T01','Cliente', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.actualizar(TEST.CLIENTE)
      await actionCliente.actualizar(TEST.CLIENTE_EXTRA)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo POST=> setCliente
      IT.Post('T01A.0','setCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
          query: { idCliente: TEST.CLIENTE },
          body: TEST.CLIENTE_BODY,
          shoulHaveStatus: 201}})
      IT.Post('T01A.1','setCliente, cuando el cliente NO EXISTE.')
      IT.Post('T01A.2','setCliente, cuando el cliente SI EXISTE.')
      
      // Metodo GET => getCliente
      IT.Get('T0B.0','getCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
          defaultOptions: {
            listHeaders: TEST.LISTHEADER_OAG,
            url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
            shoulHaveStatus: 200,
            query: { idCliente: TEST.CLIENTE }}})
      IT.Get('T01B.1','getCliente, cuando el cliente SI EXISTE.')
      IT.Get('T01B.2','getCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE }})
      IT.Get('T01B.3','getCliente, cuando no especifico el idCliente o un parametro no valido.', { shouldHaveStatus: 400, query: { Cliente: TEST.CLIENTE_NO_EXISTE } })
      

      // Metodo POST => remover cliente
      IT.Delete('T01C.0','deleteCliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
          query: { idCliente: TEST.CLIENTE_EXTRA }
        }})
      IT.Delete('T01C.1','deleteCliente, cuando el cliente SI EXISTE.')
      IT.Delete('T01C.2','deleteCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404 })
}})
