/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'
import { ESTADO_ACTIVACION_PROSPECTO, ESTADO_ACTIVACION_OTPGENERADO, ESTADO_ACTIVACION_ACTIVADO, ESTADO_ACTIVACION_BLOQUEADO, ESTADO_ACTIVACION_ERROR } from '../src/constants/constants'

SuiteTEST('T02','/cliente/estadoActivacion', { 
  commonHeaders: TEST.LISTHEADER_OAG, 
  commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
  listDefaultOption: {
    opt10: { shouldHaveStatus: 200, url: `/obtenerEstatusActivacion`, query: { idCliente: TEST.CLIENTE }},
    opt20: { shouldHaveStatus: 201, url: `/establecerEstatusActivacion`, body:{  idCliente: TEST.CLIENTE, estatusActivacion: ESTADO_ACTIVACION_PROSPECTO}},
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
      IT.Get('T02A0','opt10:400','GET: /cliente/estadoActivacion, sin OAG.', { listHeaders:[]})
      IT.Get('T02A1','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
      IT.Get('T02A2','opt10:404','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ query: { idCliente: TEST.CLIENTE_NO_EXISTE } })
      // IT.Get('T02A4','opt10:404','GET: /cliente/estadoActivacion, cuando el cliente NO EXISTE.',{ url: `/cliente//estadoActivacion` })

      // Metodo POST=> setEstadoActivacion
      IT.Post('T02B0','opt20:400','POST: /cliente/estadoActivacion, sin OAG.', { listHeaders: []})
      IT.Post('T02B1','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T02B2','opt20:404','POST: /cliente/estadoActivacion, cuando el cliente NO EXISTE.', { body: { idCliente: TEST.CLIENTE_NO_EXISTE, estatusActivacion:ESTADO_ACTIVACION_PROSPECTO } })

      // Metodos extras para covertura de codigo
      IT.Post('T02C10','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.', {body: {idCliente: TEST.CLIENTE, estatusActivacion: ESTADO_ACTIVACION_OTPGENERADO}})
      IT.Get('T02C11','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
      IT.Post('T02C20','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.',{body:{idCliente: TEST.CLIENTE, estatusActivacion: ESTADO_ACTIVACION_ACTIVADO}})
      IT.Get('T02C21','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')
      IT.Post('T02C30','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.',{body:{idCliente: TEST.CLIENTE, estatusActivacion: ESTADO_ACTIVACION_BLOQUEADO}})
      IT.Get('T02C31','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')  
      IT.Post('T02C10','opt20:201','POST: /cliente/estadoActivacion, cuando el cliente SI EXISTE.',{body:{idCliente: TEST.CLIENTE, estatusActivacion: ESTADO_ACTIVACION_ERROR}})
      IT.Get('T02C11','opt10:200','GET: /cliente/estadoActivacion, cuando el cliente SI EXISTE.')          
}})
