/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T01','cliente', { 
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
      listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE },  body: TEST.CLIENTE_BODY },

      opt20: { shouldHaveStatus: 200, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
      listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }},

      opt30: { shouldHaveStatus: 201, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente`,
      listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }},
    },
    listDefaultSub: {
      before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)}
    }
  }, { // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
    },
    after: async () => MongoDB.disconnect(), 
    tests: () => {
      // Metodo GET => postCliente
      IT.Post('T01A.0','setCliente, sin OAG.', { useOption:'opt10', runSubs: '', shouldHaveStatus: 400, listHeaders: [] })
      IT.Post('T01A.1','setCliente, cuando el cliente NO EXISTE.')
      IT.Post('T01A.2','setCliente, cuando el cliente SI EXISTE.')

      // Metodo GET => getCliente
      IT.Get('T01B.0','getCliente, sin OAG.', { useOption:'opt20', shouldHaveStatus: 400, listHeaders: []})
      IT.Get('T01B.1','getCliente, cuando el cliente SI EXISTE.')
      IT.Get('T01B.2','getCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })
      IT.Get('T01B.3','getCliente, cuando no especifico el idCliente o un parametro no valido.', { shouldHaveStatus: 400, query: { Cliente: TEST.CLIENTE } })
      
      // Metodo POST => remover cliente
      IT.Delete('T01C.0','deleteCliente, sin OAG.', { useOption:'opt30', shouldHaveStatus: 400, listHeaders: []})
      IT.Delete('T01C.1','deleteCliente, cuando el cliente SI EXISTE.')
      IT.Delete('T01C.2','deleteCliente, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404 })
}})