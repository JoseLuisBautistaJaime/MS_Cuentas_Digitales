/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/testX'

SuiteTEST('T01','cliente', { 
    commonHeaders: TEST.LISTHEADER_OAG, 
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/cliente`, query: { idCliente: TEST.CLIENTE },  body: TEST.CLIENTE_BODY },
      opt20: { shouldHaveStatus: 200, url: `/cliente`, query: { idCliente: TEST.CLIENTE }},
    },
    listDefaultSub: {
      before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)},
      before1: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminar(TEST.CLIENTE)}
    }
  }, { // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
    },
    after: async () => MongoDB.disconnect(), 
    tests: () => {
      // HAPPY PATH
      IT.PostX('T01A1','opt10','set:/cliente, cuando el cliente NO EXISTE.')
      IT.PostX('T01A2','opt10','set:/cliente, cuando el cliente SI EXISTE.')
      IT.GetX('T01A3','opt20', 'get:/cliente, cuando el cliente SI EXISTE.')
      IT.DeleteX('T01A4','opt20:201','delete/cliente, cuando el cliente SI EXISTE.')

      // Excepciones de Validaciones
      IT.PostX('T01E0','opt10:400','set:cliente, sin OAG.', { listHeaders: [] })
      IT.GetX('T01E0','opt20:400', 'get:/cliente, sin OAG.', { listHeaders: []})
      IT.DeleteX('T01E0','opt20:400','delete:/cliente, sin OAG.', { listHeaders: []})
      IT.GetX('T01E1','opt20:400', 'get:/cliente, con nombre de parametro incorrecto.', { query: { Cliente: TEST.CLIENTE } })

      // // Excepciones cuando el cliente no existe
      IT.GetX('T01B2','opt20:404', 'get:/cliente, cuando el cliente NO EXISTE.', { })
      IT.DeleteX('T01C2','opt20:404','delete:/cliente, cuando el cliente NO EXISTE.', { })
}})