// /* eslint-disable mocha/no-hooks-for-single-case */
// /* eslint-disable mocha/no-setup-in-describe */
// /* eslint-disable prettier/prettier */
// import chai from 'chai'
// import chaiHttp from 'chai-http'
// import chaiAsPromised from 'chai-as-promised'
// import nock from 'nock'
// import app from '../src/server'
// import { nmpCHAI } from './commons/nmp-CHAI'
// import { CONTEXT_NAME, CONTEXT_VERSION, URL_API_COMUNICACIONES } from '../src/commons/constants'
// import { ClienteService } from '../src/services/Cliente.Service'
// import { HEADER, TEST_CLIENTE_DATA, TEST_CLIENTE } from './commons/testHelpers'
// import { LOG } from '../src/commons'
// import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

// // let resultX

// let resultX
// chai.use(chaiHttp).use(chaiAsPromised).should()
// describe('AuthOtp.ControllerAuthOtp.Controller', () => {
//   before(() =>  nmpCHAI.rootBEFORE(async () => {
//     await ClienteService.removerCliente(TEST_CLIENTE)
//     await ActivacionEventoService.removerEventos(TEST_CLIENTE)
//   }))
//   after('rootAFTER', async () => nmpCHAI.rootAFTER())
//   nock(URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, {}) // T1.1

  
//   describe('T1. Proceso Normal de Registro.', () => {
//     resultX = nmpCHAI.itPOST({
//       testTag: 'T1.1-Enviar OTP por "email" de forma Exitosa.',
//       repiteURL: `/${CONTEXT_NAME}/${CONTEXT_VERSION}/enviarOtp`,
//       repiteBODY: { idCliente : TEST_CLIENTE, "modoEnvio": "email" },
//       shouldHaveStatus: 201, repiteOAG: true
//     })
    


//     // it('T1.1-Enviar OTP por "email" de forma Exitosa.', done => {
      
//     //   chai
//     //     .request(app)
//     //     .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/enviarOtp`)
//     //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
//     //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
//     //     .set('TestTag','T1.1-Enviar OTP por "email" de forma Exitosa.') 
//     //     .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
//     //     .end((err, res) => {
//     //       res.should.have.status(201)
//     //       codigoOtp = res.body.codigoOtp
//     //       LOG.debug(codigoOtp)
//     //       done()
//     //     })
//     // })

//     // it('T1.2-Enviar OTP por SMS de forma exitosa.', done => {
//     //   nock(URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, {})
//     //   chai
//     //     .request(app)
//     //     .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/enviarOtp`)
//     //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
//     //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
//     //     .set('TestTag','T1.2-Enviar OTP por SMS de forma exitosa.') 
//     //     .send({ idCliente : TEST_CLIENTE, "modoEnvio": "sms" })
//     //     .end((err, res) => {
//     //       res.should.have.status(201)
//     //       codigoOtp = res.body.codigoOtp
//     //       LOG.debug(codigoOtp)
//     //       done()
//     //     })
//     // })
    
//     // it('T1.3-VerificarOTP con código no valido.', done => {
//     //   chai
//     //     .request(app)
//     //     .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
//     //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
//     //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
//     //     .set('TestTag','T1.3-VerificarOTP con código no valido.') 
//     //     .send({
//     //       "idCliente": TEST_CLIENTE,
//     //       "codigoOtp": '0000',
//     //       "enviarEmail": true
//     //     })
//     //     .end((err, res) => {
//     //       res.should.have.status(201)
//     //       done()
//     //     })
//     // })
//     // it('T1.4-VerificarOTP de forma Exitosa.', done => {
//     //   nock(URL_API_COMUNICACIONES)
//     //     .post('/solicitud/mensaje')
//     //     .reply(201, {})
//     //   chai
//     //     .request(app)
//     //     .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
//     //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
//     //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
//     //     .set('TestTag','T1.4-VerificarOTP de forma Exitosa.') 
//     //     .send({
//     //       "idCliente": TEST_CLIENTE,
//     //       "codigoOtp": codigoOtp,
//     //       "enviarEmail": true
//     //     })
//     //     .end((err, res) => {
//     //       res.should.have.status(201)
//     //       LOG.debug(`TEST: codigoOtp: ${codigoOtp}`)
//     //       LOG.debug(`TEST: esValidoOtp: ${res.body.esValidoOtp}`)
//     //       done()
//     //     })
//     // })
//   })
  
// })
// // LOG.debug(`RESULT ${resultX}`)