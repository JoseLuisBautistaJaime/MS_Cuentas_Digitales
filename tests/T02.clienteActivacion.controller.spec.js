/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST('T3','clienteEstatusActivacion', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()},

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo GET=> getEstatusActivacion
      IT.Get('T3A.0','GET: /cliente/estatusActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estatusActivacion`,
          query: { idCliente: TEST.CLIENTE },
          shoulHaveStatus: 200}})
      IT.Get('T3A.1','GET: /cliente/estatusActivacion, cuando el cliente SI EXISTE.')          
      IT.Get('T3A.2','GET: /cliente/estatusActivacion, cuando el cliente NO EXISTE.',{ shoulHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> setEstatusActivacion
      IT.Post('T3B.0','setEstatusActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/estatusActivacion`,
          body: { idCliente: TEST.CLIENTE, estatusActivacion: 2},
          shoulHaveStatus: 201}})
      IT.Post('T3B.2','POST: /cliente/estatusActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T3B.1','POST: /cliente/estatusActivacion, cuando el cliente NO EXISTE.', 
      { shouldHaveStatus: 404, body: { idCliente: TEST.CLIENTE_NO_EXISTE, estatusActivacion: 2}})
}})

