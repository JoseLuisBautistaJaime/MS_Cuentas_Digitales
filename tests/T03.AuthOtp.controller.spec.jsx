/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../src/commons/connection'
import { ClienteService } from '../src/services/Cliente.Service'
import { clienteActivacionService } from '../src/services/clienteActivacion.Service'
import { testHelpers, HEADER, TEST_CLIENTE, TEST_CLIENTE_DATA } from './testHelpers'

import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server

chai.use(chaiHttp).use(chaiAsPromised).should()
describe('VerificarOtp-Excepciones', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
    await ClienteService.removerCliente(TEST_CLIENTE)
    await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })
  
  /** TEST #2- CUANDO EL CLIENTE NO EXISTE */
  describe('T3A. Excepciones al VerificarOTP.', () => {
    it('T3A.0-VerificarOTP, con headers incompletos.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('TestTag','T3A.0-VerificarOTP, con headers incompletos.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": true })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('T3A.1-VerificarOTP, cuando el cliente NO EXISTE.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T3A.1-VerificarOTP, cuando el cliente NO EXISTE.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": false  })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  describe('T3B. VerificarOtp-Excepciones.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
      await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 2,'1234')
      await ActivacionEventoService.removerEventos(TEST_CLIENTE)
    })
    it('T3B.2-VerificarOTP, con estatus no valido.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T3B.2-VerificarOTP, con estatus no valido.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000' })
        .end((err, res) => {
          res.should.have.status(214)
          done()
        })
    })
  })

  describe('T3C. VerificarOtp-Excepciones.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await testHelpers.bloquearClienteConEnviosOtp()
    })
    it('T3C.3-VerificarOTP, con cuenta bloqueada y CON EVENTOS VIGENTES.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T3C.3-VerificarOTP, con cuenta bloqueada y CON EVENTOS VIGENTES.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": false })
        .end((err, res) => {
          res.should.have.status(203)
          done()
        })
    })
  })

  describe('T3D. VerificarOtp-Excepciones.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await testHelpers.bloquearClienteSinEventos()
    })
    it('T3C.3-VerificarOTP, con cuenta bloqueada y SIN EVENTOS VIGENTES.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .set('TestTag','T3C.3-VerificarOTP, con cuenta bloqueada y SIN EVENTOS VIGENTES.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": false })
        .end((err, res) => {
          res.should.have.status(214)
          done()
        })
    })
  })
})