/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/testX'

SuiteTEST('T02','/cliente/estadoActivacion', { 
  commonHeaders: TEST.LISTHEADER_OAG, 
  commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
  listDefaultOption: {
    opt10: { shouldHaveStatus: 200, url: `/cliente/${TEST.CLIENTE}/estadoActivacion`},
    opt20: { shouldHaveStatus: 201, url: `/cliente/${TEST.CLIENTE}/estadoActivacion`, body:{ estadoActivacion: 2}},
  },
    listDefaultSub: {
      before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)}
    }
},{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
    },
    after: async () => MongoDB.disconnect(), 
    tests: () => {
      // Metodo GET=> getEstadoActivacion
      IT.GetX('T02A0','opt10:400','GET: /cliente/estadoActivacion, sin OAG.', { listHeaders:[]})
      IT.GetX('T02A1','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
      IT.GetX('T02A2','opt10:404','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/estadoActivacion` })
      IT.GetX('T02A4','opt10:404','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ url: `/cliente//estadoActivacion` })

      // Metodo POST=> setEstadoActivacion
      IT.PostX('T02B0','opt20:400','POST: /cliente/estadoActivacion, sin OAG.', { listHeaders: []})
      IT.PostX('T02B1','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')
      IT.PostX('T02B2','opt20:404','POST: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/estadoActivacion` })
}})
