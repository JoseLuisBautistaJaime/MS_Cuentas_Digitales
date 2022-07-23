/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION, URL_API_COMUNICACIONES } from '../src/commons/constants'
import { getMongoConnectionString } from './commons/pi8-test-nmp-actions-mongodb'
import { createConnection } from '../src/commons/connection'
import { ClienteService } from '../src/services/Cliente.Service'
// import { clienteActivacionService } from '../src/services/clienteActivacion.Service'
import {testHelpers, HEADER, TEST_CLIENTE_DATA, TEST_CLIENTE } from './commons/testHelpers'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server



chai.use(chaiHttp).use(chaiAsPromised).should()
describe('AuthOtp.Controller', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })
  

  describe('T2A. Excepciones al Enviar OTP.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      ClienteService.removerCliente(TEST_CLIENTE)
      ActivacionEventoService.removerEventos(TEST_CLIENTE)
    })
    it('T2A.0-EnviarOTP, con headers incompletos.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('TestTag','T2A.0-EnviarOTP, con headers incompletos.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('T2A.1-EnviarOTP, cuando el cliente no existe.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T2A.1-EnviarOTP, cuando el cliente no existe.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  describe('T2B. Excepciones al Enviar OTP.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
      ActivacionEventoService.removerEventos(TEST_CLIENTE)
    })
    it('T2.2-EnviarOTP, por medio de comunicación no válido.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T2.2-EnviarOTP, por medio de comunicación no válido.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "fax" })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('T2B.3-EnviarOTP, con comunicaciones fallando.', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(500, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T2B.3-EnviarOTP, con comunicaciones fallando.') 
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(500)
          done()
        })
    })
  })

  describe('T2C. Excepciones al Enviar OTP.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await testHelpers.bloquearClienteConEnviosOtp()
    })
    it('T2C.4-EnviarOTP, cuando el cliente esta bloqueado y CON EVENTOS VIGENTES.', done => {
        nock(URL_API_COMUNICACIONES)
          .post('/solicitud/mensaje')
          .reply(201, {})
        chai
          .request(app)
          .post(`/${context}/${version}/enviarOtp`)
          .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
          .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
          .set('TestTag','T2C.4-EnviarOTP, cuando el cliente esta bloqueado y CON EVENTOS VIGENTES.') 
          .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
          .end((err, res) => {
            res.should.have.status(203)
            done()
          })
    })
  })
  
  describe('T2D. Excepciones al Enviar OTP.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      ActivacionEventoService.removerEventos(TEST_CLIENTE)
    })
    it('T2D.5-Enviar OTP por EMAIL, cuando el cliente esta bloqueado y SIN EVENTOS VIGENTES.', done => {
        nock(URL_API_COMUNICACIONES)
          .post('/solicitud/mensaje')
          .reply(201, {})
        chai
          .request(app)
          .post(`/${context}/${version}/enviarOtp`)
          .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
          .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
          .set('TestTag','T2D.5-Enviar OTP por EMAIL, cuando el cliente esta bloqueado y SIN EVENTOS VIGENTES.') 
          .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
    })
  })      
})