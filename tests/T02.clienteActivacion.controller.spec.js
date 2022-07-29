/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT } from './commons/cd-test-nmp'
import { SuiteTEST, IT } from './commons/cd-test'

SuiteTEST('T3','clienteEstatusActivacion', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()},

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo POST=> obtenerEstatusActivacion
      IT.Get('T3A.0','obtenerEstatusActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/obtenerEstatusActivacion`,
          query: { idCliente: TEST.CLIENTE },
          shoulHaveStatus: 200}})
      IT.Get('T3A.1','obtenerEstatusActivacion, cuando el cliente SI EXISTE.')          
      IT.Get('T3A.2','obtenerEstatusActivacion, cuando el cliente NO EXISTE.',{ shoulHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> establecerEstatusActivacion
      IT.Post('T3B.0','establecerEstatusActivacion, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/establecerEstatusActivacion`,
          body: { idCliente: TEST.CLIENTE, estatusActivacion: 2},
          shoulHaveStatus: 201}})
      IT.Post('T3B.2','establecerEstatusActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T3B.1','establecerEstatusActivacion, cuando el cliente NO EXISTE.', 
      { shouldHaveStatus: 404, body: { idCliente: TEST.CLIENTE_NO_EXISTE, estatusActivacion: 2}})
}})

