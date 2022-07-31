/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T02','/cliente/estadoActivacion', { 
    listDefaultOption: {
      opt10: { shouldHaveStatus: 200, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion`,
      listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }},
      opt20: { shouldHaveStatus: 201, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion`,
      listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }, body:{ estadoActivacion: 2}},
    },
    listDefaultSub: {
      before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)}
    }
},{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo GET=> getEstadoActivacion
      IT.Get('T02A.0','GET: /cliente/estadoActivacion, sin OAG.', { useOption:'opt10', shouldHaveStatus: 400, listHeaders:[]})
      IT.Get('T02A.1','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
      IT.Get('T02A.2','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ shoulHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> setEstadoActivacion
      IT.Post('T02B.0','setEstadoActivacion, sin OAG.', { useOption:'opt20', shouldHaveStatus: 400, listHeaders: []})
      IT.Post('T02B.1','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T02B.2','POST: /cliente/estadoActivacion, cuando el cliente NO EXISTE.', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE }})
}})