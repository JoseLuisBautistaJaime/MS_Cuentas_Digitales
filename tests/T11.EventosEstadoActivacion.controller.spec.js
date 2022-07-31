/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T11','/cliente/estadoActivacion/eventos', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.actualizar(TEST.CLIENTE)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo POST=> activacionEvento/eventos
      IT.Get('T11A.0','GET: /cliente/estadoActivacion/eventos, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion/eventos`,
          query: { idCliente: TEST.CLIENTE },
          shouldHaveStatus: 200}})
      IT.Get('T11A.1','GET: /cliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')          
      IT.Get('T11A.2','GET: /cliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.', { shouldHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> setEstadoActivacion
      IT.Delete('T11B.0','DELETE: /cliente/estadoActivacion/eventos, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion/eventos`,
          query: { idCliente: TEST.CLIENTE},
          body: { estadoActivacion: 2},
          shouldHaveStatus: 201}})
      IT.Delete('T11B.1','DELETE: /cliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')
      IT.Delete('T11B.2','DELETE: /cliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.', { query: {idCliente: TEST.CLIENTE_NO_EXISTE}})
}})

