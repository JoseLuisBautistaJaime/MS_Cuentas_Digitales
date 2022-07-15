/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION, URL_API_COMUNICACIONES } from '../src/commons/constants'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../src/commons/connection'
import { ClienteService } from '../src/services/Cliente.Service'
import { HEADER, TEST_CLIENTE_DATA, TEST_CLIENTE } from './testHelpers'
import { LOG } from '../src/commons'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server
let codigoOtp


chai.use(chaiHttp).use(chaiAsPromised).should()
describe('AuthOtp.ControllerAuthOtp.Controller', () => {
  before('Configuración inicial de cuenta del cliente.', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
    ClienteService.removerCliente(TEST_CLIENTE)
    ActivacionEventoService.removerEventos(TEST_CLIENTE)
    ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })

  /** TEST #1- PROCESO NORMAL DE REGISTRO */
  describe('T1. Proceso Normal de Registro.', () => {
    it('T1.1-Enviar OTP por "email" de forma Exitosa.', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T1.1-Enviar OTP por "email" de forma Exitosa.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(200)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })

    it('T1.2-Enviar OTP por SMS de forma exitosa.', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T1.2-Enviar OTP por SMS de forma exitosa.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "sms" })
        .end((err, res) => {
          res.should.have.status(200)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })
    
    it('T1.3-VerificarOTP con código no valido.', done => {
      chai
        .request(app)
        .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T1.3-VerificarOTP con código no valido.') 
        .send({
          "idCliente": TEST_CLIENTE,
          "codigoOtp": '0000',
          "enviaremail": true
        })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
    it('T1.4-VerificarOTP de forma Exitosa.', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T1.4-VerificarOTP de forma Exitosa.') 
        .send({
          "idCliente": TEST_CLIENTE,
          "codigoOtp": codigoOtp,
          "enviaremail": true
        })
        .end((err, res) => {
          res.should.have.status(200)
          LOG.debug(`TEST: codigoOtp: ${codigoOtp}`)
          LOG.debug(`TEST: esValidoOtp: ${res.body.esValidoOtp}`)
          done()
        })
    })
  })
})