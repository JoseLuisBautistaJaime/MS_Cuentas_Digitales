/* eslint-disable prettier/prettier */
import nock from 'nock'
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'
import { log } from '../src/commons/log'

let codigoOtp = "0000"
SuiteTEST('T21','enviarOtp', { 
  commonHeaders: TEST.LISTHEADER_OAG, 
  commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/enviarOtp`, body: { idCliente: TEST.CLIENTE, modoEnvio: 'email' }},
      opt20: { shouldHaveStatus: 201, url: `/verificarOtp`, body: { idCliente: TEST.CLIENTE, codigoOtp: '0000' }}
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
      IT.Post('T21A0','opt10:201','Enviar OTP por EMAIL.', {  run: 'before1', body: { idCliente: TEST.CLIENTE, modoEnvio: 'sms' }}, { end: (err,res) => { codigoOtp = res.body.codigoOtp }})
      IT.Post('T21A0','opt10:201','Enviar OTP por EMAIL.', {  run: 'before1'}, { end: (err,res) => { codigoOtp = res.body.codigoOtp }})
      IT.Post('T21A1','opt20:201','Verificar OTP, con OTP VALIDO. ', {run: 'before1'}, { send: () => { return {  idCliente: TEST.CLIENTE, "codigoOtp": codigoOtp  } }})

      // // POST-EnviarOTP
      IT.Post('T21A0','opt10:400','Enviar OTP, SIN OAG.', { listHeaders: []})
      IT.Post('T21A1','opt10:404','Enviar OTP, con cliente que NO EXISTE',{ body: { idCliente: TEST.CLIENTE_NO_EXISTE, modoEnvio: 'email' } })
      IT.Post('T21A1','opt10:201','Enviar OTP por EMAIL.', { run: 'before1'})      
      IT.Post('T21A3','opt10:400','Enviar OTP, sin definir modoEnvio', { body: {idCliente: TEST.CLIENTE }})        
      IT.Post('T21A4','opt10:400','Enviar OTP, con modoEnvio NO VALIDO', { body: { idCliente: TEST.CLIENTE, "modoEnvio": "fax" }})
      IT.Post('T21A5','opt10:500','Enviar OTP, con MS_COMUNICACIONES, fallando.', { run: 'before2' })
      
      // POST-Verificar OTP
      IT.Post('T21B0','opt20:400','Verificar OTP, sin OAG.', { listHeaders: [] })
      IT.Post('T21B1','opt20:404','Verificar OTP, con cliente que NO EXISTE.', { body: {  idCliente: TEST.CLIENTE_NO_EXISTE, "codigoOtp": codigoOtp  } })
      IT.Post('T21B2','opt20:214','Verificar OTP, con codigo INVALIDO.')
      IT.Post('T21B3','opt20:214','Verificar OTP, sin haber enviado OTP.', { run:'before0'})

      // Excepciones con BLOQUEO
      IT.Post('T21C1','opt10:203','Enviar OTP, cuenta bloqueada.', { run: 'before3' })
      IT.Post('T21C2','opt20:203','Verificar OTP, cuenta bloqueada.', { run: 'before3' })
      IT.Post('T21C3','opt20:214','Verificar OTP, cuenta bloqueada y eventos expirados', { run: 'before4' })
}})