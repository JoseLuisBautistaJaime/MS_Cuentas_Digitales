/* eslint-disable prettier/prettier */
import nock from 'nock'
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/testX'
import { log } from '../src/commons/log'

let codigoOtp = "0000"
SuiteTEST('T21','enviarOtp', { 
  commonHeaders: TEST.LISTHEADER_OAG, 
  commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/cliente/${TEST.CLIENTE}/enviarOtp`, body: { "modoEnvio": "email" }},
      opt20: { shouldHaveStatus: 201, url: `/cliente/${TEST.CLIENTE}/verificarOtp`, body: { "codigoOtp": '0000' }}
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
      IT.PostX('T21A0','opt10:201','Enviar OTP por SMS.', {  run: 'before1', body: { "modoEnvio": "sms" }}, { end: (err,res) => { codigoOtp = res.body.codigoOtp }})
      IT.PostX('T21A1','opt20:201','Verificar OTP, con OTP VALIDO. ', {run: 'before1'}, { send: () => { return { "codigoOtp": codigoOtp  } }})

      // // POST-EnviarOTP
      IT.PostX('T21A0','opt10:400','Enviar OTP, SIN OAG.', { listHeaders: []})
      IT.PostX('T21A1','opt10:404','Enviar OTP, con cliente que NO EXISTE',{ url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/enviarOtp` })
      IT.PostX('T21A1','opt10:201','Enviar OTP por EMAIL.', { run: 'before1'})      
      IT.PostX('T21A3','opt10:400','Enviar OTP, sin definir modoEnvio', { body: { }})        
      IT.PostX('T21A4','opt10:400','Enviar OTP, con modoEnvio NO VALIDO', { body: { "modoEnvio": "fax" }})
      IT.PostX('T21A5','opt10:500','Enviar OTP, con MS_COMUNICACIONES, fallando.', { run: 'before2' })
      
      // // POST-Verificar OTP
      IT.PostX('T21B0','opt20:400','Verificar OTP, sin OAG.', { listHeaders: [] })
      IT.PostX('T21B1','opt20:404','Verificar OTP, con cliente que NO EXISTE.', { url: `/cliente/${TEST.CLIENTE_NO_EXISTE}/verificarOtp` })
      IT.PostX('T21B2','opt20:201','Verificar OTP, con codigo INVALIDO.')
      IT.PostX('T21B3','opt20:214','Verificar OTP, sin haber enviado OTP.', { run:'before0'})

      // // // Excepciones con BLOQUEO
      IT.PostX('T21C1','opt10:203','Enviar OTP, cuenta bloqueada.', { run: 'before3' })
      IT.PostX('T21C2','opt20:203','Verificar OTP, cuenta bloqueada.', { run: 'before3' })
      IT.PostX('T21C3','opt20:214','Verificar OTP, cuenta bloqueada y eventos expirados', { run: 'before4' })
}})