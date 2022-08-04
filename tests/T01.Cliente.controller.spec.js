/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T01','cliente', { 
    commonHeaders: TEST.LISTHEADER_OAG, 
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/actualizarCliente`, body: TEST.CLIENTE_BODY  },
      opt20: { shouldHaveStatus: 200, url: `/obtenerCliente`, query: { idCliente: TEST.CLIENTE }},
      opt30: { shouldHaveStatus: 201, url: `/removerCliente`, query: { idCliente: TEST.CLIENTE }},
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
      IT.Post('T01A1','opt10','Actualizar Cliente, cuando el cliente NO EXISTE.')
      IT.Post('T01A2','opt10','Actualizar Cliente, cuando el cliente SI EXISTE.')
      IT.Get('T01A3','opt20', 'Obtener Cliente, cuando el cliente SI EXISTE.')
      IT.Post('T01A4','opt30','Eliminar Cliente, cuando el cliente SI EXISTE.')
      
      // Excepciones de Validacion
      IT.Post('T01E0','opt10:400','set:cliente, sin OAG.', { listHeaders: [] })
      IT.Get('T01E1','opt20:400', 'get:/cliente, sin OAG.', { listHeaders: []})
      IT.Post('T01E2','opt30:400','delete:/cliente, sin OAG.', { listHeaders: []})
      IT.Get('T01E3','opt20:400', 'get:/cliente, con nombre de parametro incorrecto.', { query: { Cliente: TEST.CLIENTE } })

      // Excepciones cuando el cliente no existe
      IT.Get('T01B2','opt20:404', 'get:/cliente, cuando el cliente NO EXISTE.', { })
      IT.Post('T01C2','opt30:404','delete:/cliente, cuando el cliente NO EXISTE.', { query: { idCliente: TEST.CLIENTE_NO_EXISTE } })
}})