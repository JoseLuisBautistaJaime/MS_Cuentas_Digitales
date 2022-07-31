/* eslint-disable prettier/prettier */
import nock from 'nock'
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

let codigoOtp = "0000"
SuiteTEST('T21','enviarOtp', { 
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/enviarOtp`,
        listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }, body: { "modoEnvio": "email" }},
      opt20: { shouldHaveStatus: 201, url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/verificarOtp`,
        listHeaders: TEST.LISTHEADER_OAG, query: { idCliente: TEST.CLIENTE }, body: { "codigoOtp": '0000', "enviarEmail": true }}
    },
    listDefaultSub: {
      before0: { title: 'Reiniciar Cliente', sub: () => actionCliente.reiniciar(TEST.CLIENTE)},
      before1: { title: 'NOCK-MS_COMUNICACIONES-201', sub: () => nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, {statusRequest: 201, message: 'NOCK' })},
      before2: { title: 'NOCK-MS_COMUNICACIONES-400', sub: () => nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(400, {statusRequest: 400, message: 'NOCK' })},
      before3: { title: 'BLOQUEAR-CUENTA.', sub: async () => actionCliente.bloquearConEnvios(TEST.CLIENTE)},
      before4: { title: 'BLOQUEAR-CUENTA-SIN-EVENTOS', sub: async () => actionCliente.bloquearSinEventos(TEST.CLIENTE)}, 
    }
  }, { // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
    },
    after: async () => MongoDB.disconnect(), 
    tests: () => {
      // HAPPY PATH
      IT.Post('T21A.0','Enviar OTP por SMS.', { useOption:'opt10', runSubs: 'before1', body: { "modoEnvio": "sms" }, end: (err,res) => { codigoOtp = res.body.codigoOtp }})
      IT.Post('T21A.1','Verificar OTP, con OTP VALIDO. ', { useOption:'opt20', shouldHaveStatus: 201 }, { send: () => { return { "codigoOtp": codigoOtp, "enviarEmail": true } }})

      // POST-EnviarOTP
      IT.Post('T21A.0','Enviar OTP, SIN OAG.', { useOption:'opt10', shouldHaveStatus: 400, listHeaders: []})
      IT.Post('T21A.1','Enviar OTP, con cliente que NO EXISTE', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE }})      
      IT.Post('T21A.1','Enviar OTP por EMAIL.', { runSubs: 'before1'})      
      IT.Post('T21A.3','Enviar OTP, sin definir modoEnvio', { shouldHaveStatus: 400, body: { }})        
      IT.Post('T21A.4','Enviar OTP, con modoEnvio NO VALIDO', { shouldHaveStatus: 400, body: { "modoEnvio": "fax" }})
      IT.Post('T21A.5','Enviar OTP, con MS_COMUNICACIONES, fallando.', { runSubs: 'before2', shouldHaveStatus: 500 })
      
      // POST-Verificar OTP
      IT.Post('T21B.0','Verificar OTP, sin OAG.', { useOption:'opt20', shouldHaveStatus: 400, listHeaders: [] })
      IT.Post('T21B.1','Verificar OTP, con cliente que NO EXISTE.', { shouldHaveStatus: 404, query: { idCliente: TEST.CLIENTE_NO_EXISTE }})
      IT.Post('T21B.2','Verificar OTP, con codigo INVALIDO.', { shouldHaveStatus: 201})
      IT.Post('T21B.3','Verificar OTP, sin haber enviado OTP.', { shouldHaveStatus: 214, runSubs:'before0'})

      // // Excepciones con BLOQUEO
      IT.Post('T21C.1','Enviar OTP, cuenta bloqueada.', { useOption:'opt10', runSubs: 'before3', shouldHaveStatus: 203})
      IT.Post('T21C.2','Verificar OTP, cuenta bloqueada.', { useOption:'opt20', runSubs: 'before3', shouldHaveStatus: 203 })
      IT.Post('T21C.3','Verificar OTP, cuenta bloqueada y eventos expirados', { runSubs: 'before4', shouldHaveStatus: 214 })
}})