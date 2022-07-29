/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T3','/cliente/estadoActivacion', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()},

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo GET=> getEstadoActivacion
      IT.Get('T3A.0','GET: /cliente/estadoActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion`,
          query: { idCliente: TEST.CLIENTE },
          shoulHaveStatus: 200}})
      IT.Get('T3A.1','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
      IT.Get('T3A.2','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ shoulHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> setEstadoActivacion
      IT.Post('T3B.0','setEstadoActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estadoActivacion`,
          body: { idCliente: TEST.CLIENTE, estadoActivacion: 2},
          shoulHaveStatus: 201}})
      IT.Post('T3B.2','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T3B.1','POST: /cliente/estadoActivacion, cuando el cliente NO EXISTE.', 
      { shouldHaveStatus: 404, body: { idCliente: TEST.CLIENTE_NO_EXISTE, estadoActivacion: 2}})
}})

