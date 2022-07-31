/* eslint-disable prettier/prettier */
import nock from 'nock'
import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

let codigoOtp = "1234"

SuiteTEST('T21','enviarOtp', { suiteTestIgnore: false } ,{ // callbakcs
    before: async () => { 
      await MongoDB.connect()
      await actionCliente.reiniciar(TEST.CLIENTE)
      await actionCliente.actualizar(TEST.CLIENTE_EXTRA)
      await actionCliente.reiniciar(TEST.CLIENTE_EXTRA)
    },

    after: async () => { 
      MongoDB.disconnect()}, 
    tests: () => {
      // POST-EnviarOTP
      IT.Post('T21A.0','Enviar un OTP al cliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/enviarOtp`,
          body: { idCliente : TEST.CLIENTE, "modoEnvio": "email" },
          shouldHaveStatus: 201 },
        defaultSubs: {
          before1: { title: 'NOCK-MS_COMUNICACIONES-201', 
            sub: () => nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, {statusRequest: 201, message: 'NOCK' })},
          before2: { title: 'NOCK-MS_COMUNICACIONES-400',
            sub: () => nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(400, {statusRequest: 400, message: 'NOCK' })},
          before3: { title: 'CLIENTE-BLOQUEAR proceso de activacon, con envios.',
            sub: async () => actionCliente.bloquearConEnvios(TEST.CLIENTE_EXTRA)},
          before4: { title: 'CLIENTE-BLOQUEAR proceso de activacon, con envios y eliminar eventos',
            sub: async () => actionCliente.bloquearSinEventos(TEST.CLIENTE_EXTRA)}
      }})
      IT.Post('T21A.0','Enviar OTP, por email a un cliente que NO EXISTA', { shouldHaveStatus: 404, 
        body: { idCliente : TEST.CLIENTE_NO_EXISTE, "modoEnvio": "email" }})      
      IT.Post('T21A.1','Enviar OTP exitosamente, por email.', {runSubs: 'before1'})          
      IT.Post('T21A.2','Enviar OTP exitosamente, por sms.', { runSubs: 'before1',
        body: { idCliente : TEST.CLIENTE, "modoEnvio": "sms" },
        end: (err,res) => { codigoOtp = res.body.codigoOtp }})
      IT.Post('T21A.3','Enviar OTP, sin definir medio', { shouldHaveStatus: 400, 
        body: { idCliente : TEST.CLIENTE }})        
      IT.Post('T21A.4','Enviar OTP, por FAX. (medio no valido)', { shouldHaveStatus: 400, 
        body: { idCliente : TEST.CLIENTE, "modoEnvio": "fax" }})
      IT.Post('T21A.5','Enviar OTP, por email, pero MS_COMUNICACIONES, fallando.', { runSubs: 'before2', shouldHaveStatus: 500 })
      
      // POST-Verificar OTP
      IT.Post('T21B.0','Verificar un OTP al cliente, sin OAG.', { shouldHaveStatus: 400, listHeaders: [],
        defaultOptions: {
          listHeaders: TEST.LISTHEADER_OAG,
          url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/verificarOtp`,
          body: { "idCliente": TEST.CLIENTE, "codigoOtp": '0000', "enviarEmail": true },
          runs: '',
          shouldHaveStatus: 201}})
      
      IT.Post('T21B.1','Verificar un OTP al cliente, con cliente que NO EXISTA.', { shouldHaveStatus: 404,
        body: { "idCliente": TEST.CLIENTE_NO_EXISTE, "codigoOtp": "0000" }})

      IT.Post('T21B.2','Verificar un OTP al cliente, con codigo INVALIDO.', { shouldHaveStatus: 201,
        body: { "idCliente": TEST.CLIENTE, "codigoOtp": "0000" }})

      IT.Post('T21B.3','Verificar un OTP al cliente, sin haberlo enviado.', { shouldHaveStatus: 214,
        body: { "idCliente": TEST.CLIENTE_EXTRA, "codigoOtp": "1234", "enviarEmail": true }})
      
      IT.Post('T21B.4','Verificar un OTP al cliente, con codigo VALIDO. ', { shouldHaveStatus: 201 }
        ,{ send: () => { return {"idCliente": TEST.CLIENTE, "codigoOtp": codigoOtp, "enviarEmail": true } }})

      // // Excepciones con BLOQUEO
      IT.Post('T21C.1','Enviar OTP, por email, pero con cliente bloqueado por exceso de envios.', { runSubs: 'before3', shouldHaveStatus: 203,
        listHeaders: TEST.LISTHEADER_OAG,
        url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/enviarOtp`,
        body: { idCliente : TEST.CLIENTE_EXTRA, "modoEnvio": "email" },
        send: () => { return {"idCliente": TEST.CLIENTE, "codigoOtp": codigoOtp, "enviarEmail": true } }})

      IT.Post('T21C.2','Verificar OTP, por email, pero con cliente bloqueado por exceso de envios.', { runSubs: 'before3', testIgnore: false, 
        shouldHaveStatus: 203,
        listHeaders: TEST.LISTHEADER_OAG,
        url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/verificarOtp`,
        body: { "idCliente": TEST.CLIENTE_EXTRA, "codigoOtp": "0000", "enviarEmail": true }})

      IT.Post('T21C.3','Verificar OTP, por email, pero con cliente bloqueado por exceso de envios, y sin eventos', { runSubs: 'before4', testIgnore: false, 
        shouldHaveStatus: 214,
        listHeaders: TEST.LISTHEADER_OAG,
        url: `/${CONTEXT.NAME}/${CONTEXT.VERSION}/cliente/verificarOtp`,
        body: { "idCliente": TEST.CLIENTE_EXTRA, "codigoOtp": "0000", "enviarEmail": true }})
}})