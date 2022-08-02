/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T11','/cliente/estadoActivacion/eventos', {  
  commonHeaders: TEST.LISTHEADER_OAG, 
  commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
  listDefaultOption: {
    opt10: { shouldHaveStatus: 200, url: `/cliente/${TEST.CLIENTE}/estadoActivacion/eventos`},
    opt20: { shouldHaveStatus: 201, url: `/cliente/${TEST.CLIENTE}/estadoActivacion/eventos`, body:{ estadoActivacion: 2}},
  },
  listDefaultSub: {
    before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)}
  }
} ,{
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.actualizar(TEST.CLIENTE)
    },

    after: async () => MongoDB.disconnect(), 
    tests: () => {
      // Metodo POST=> activacionEvento/eventos
      IT.Get('T11A0','opt10:400','GET: /cliente/:idCliente/estadoActivacion/eventos, sin OAG.', { listHeaders: []})
      IT.Get('T11A1','opt10:200','GET: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')          
      IT.Get('T11A2','opt10:404','GET: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.',{ url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/estadoActivacion/eventos` })

      // // Metodo POST=> setEstadoActivacion
      IT.Delete('T11B0','opt20:400','DELETE: /cliente/:idCliente/estadoActivacion/eventos, sin OAG.', { listHeaders: []})
      IT.Delete('T11B1','opt20:201','DELETE: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')
      IT.Delete('T11B2','opt20:404','DELETE: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.',{ url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/estadoActivacion/eventos` })
}})

