/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/pi8-test-nmp'
import { SuiteTEST, IT } from './commons/pi8-test'

SuiteTEST('T11','activacionEvento/eventos', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.actualizar(TEST.CLIENTE)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // Metodo POST=> activacionEvento/eventos
      IT.Get('T1A.0','activacionEvento/eventos, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/activacionEvento/eventos`,
          query: { idCliente: TEST.CLIENTE },
          shouldHaveStatus: 200}})
      IT.Get('T11A.1','activacionEvento/eventos, cuando el cliente SI EXISTE.')          
      IT.Get('T11A.2','activacionEvento/eventos, cuando el cliente NO EXISTE.', { shouldHaveStatus:404, query: { idCliente: TEST.CLIENTE_NO_EXISTE } })

      // Metodo POST=> establecerEstatusActivacion
      IT.Delete('T3B.0','activacionEvento/eventos, sin OAG.', { testIgnore: false, shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/activacionEvento/eventos`,
          query: { idCliente: TEST.CLIENTE},
          body: { estatusActivacion: 2},
          shouldHaveStatus: 201}})
      IT.Delete('T11B.2','activacionEvento/eventos, cuando el cliente SI EXISTE.')
      IT.Delete('T3B.1','establecerEstatusActivacion, cuando el cliente NO EXISTE.', { query: {idCliente: TEST.CLIENTE_NO_EXISTE}})
}})

