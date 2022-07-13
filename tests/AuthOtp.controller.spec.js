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
import { clienteActivacionService } from '../src/services/clienteActivacion.Service'
import { testHelpers, HEADER, TEST_CLIENTE_DATA, TEST_CLIENTE } from './testHelpers'
import { LOG } from '../src/commons'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server
let codigoOtp


chai.use(chaiHttp).use(chaiAsPromised).should()
describe('AuthOtp', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
    // testHelpers.reiniciarCliente()
    ClienteService.removerCliente(TEST_CLIENTE)
    ActivacionEventoService.removerEventos(TEST_CLIENTE)
    // ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })

  const requestEnvarOtpEmailBody = {
    idCliente : TEST_CLIENTE,
    "modoEnvio": "email"
  }

  
  /** TEST #1- CUANDO EL CLIENTE NO EXISTE */
  describe('T1 Enviar OTP modo EMAIL, cuando el cliente NO EXISTE', () => {
    it('T1.1-Enviar OTP por EMAIL-Cuando el cliente no existe', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send(requestEnvarOtpEmailBody)
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    it('T1.2-VerificarOTP cuando el cliente NO EXISTE', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send({
          "idCliente": TEST_CLIENTE,
          "codigoOtp": '0000',
          "enviaremail": true
        })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
  })

  /** TEST #2- METODOS CUANDO EL CLIENTE EXISTE */
  describe('T2. Cuenta del Cliente Reiniciada.', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
    })
    it('T2.1-Enviar OTP por Medio No Valido', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "fax" })
        .end((err, res) => {
          res.should.have.status(400)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })

    it('T2.2-Enviar OTP - Con comunicaciones fallando.', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(500, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(500)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })


    it('T2.3-Enviar OTP por "email" de forma Exitosa', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "email" })
        .end((err, res) => {
          res.should.have.status(200)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })

    it('T2.3-Enviar OTP por SMS de forma exitosa', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${context}/${version}/enviarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
        .send({ idCliente : TEST_CLIENTE, "modoEnvio": "sms" })
        .end((err, res) => {
          res.should.have.status(200)
          codigoOtp = res.body.codigoOtp
          LOG.debug(codigoOtp)
          done()
        })
    })
    it('T2.3-Verificar OTP de con codigo no valido', done => {
      chai
        .request(app)
        .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
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
    
    it('T2.4-Verificar OTP de forma Exitosa', done => {
      nock(URL_API_COMUNICACIONES)
        .post('/solicitud/mensaje')
        .reply(201, {})
      chai
        .request(app)
        .post(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/verificarOtp`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)
        .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
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



  /** TEST #3- CLIENTE BLOQUEADO SIN EVENTOS */
  describe('T3. Cuenta bloquada del Cliente, sin ventos', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await testHelpers.bloquearClienteSinEventos()
    })
    it('T3.1-Enviar OTP por EMAIL de forma exitosa (desbloqueando cuenta) ', done => {
        nock(URL_API_COMUNICACIONES)
          .post('/solicitud/mensaje')
          .reply(201, {})
        chai
          .request(app)
          .post(`/${context}/${version}/enviarOtp`)
          .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
          .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
          .send(requestEnvarOtpEmailBody)
          .end((err, res) => {
            res.should.have.status(200)
            codigoOtp = res.body.codigoOtp
            LOG.debug(codigoOtp)
            done()
          })
    })
  })      

  /** TEST #4- CLIENTE CON CUENTA BLOQUEADO CON EVENTOS */
  describe('T4. Enviar OTP por EMAIL- Cliente Bloqueado CON EVENTOS', () => {
    before('Configuración inicial de cuenta del cliente.', async () => {
      await testHelpers.bloquearClienteConEnviosOtp()
    })
    it('T4.1 Tratar de Enviar OTP por EMAIL.', done => {
        nock(URL_API_COMUNICACIONES)
          .post('/solicitud/mensaje')
          .reply(201, {})
        chai
          .request(app)
          .post(`/${context}/${version}/enviarOtp`)
          .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
          .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
          .send(requestEnvarOtpEmailBody)
          .end((err, res) => {
            res.should.have.status(203)
            codigoOtp = res.body.codigoOtp
            LOG.debug(codigoOtp)
            done()
          })
    })
  })


    /** TEST #5- VerificarOTP-Excepciones */
    describe('T5.VerificarOTP-Excepciones', () => {
      describe('T5.1. Estatus Incorrecto', () => {
        before('Configuración inicial de cuenta del cliente.', async () => {
          await clienteActivacionService.establecerEstatusActivacion(TEST_CLIENTE, 2,'1234')
          await ActivacionEventoService.removerEventos(TEST_CLIENTE)
        })
        it('Enviar OTP por EMAIL', done => {
          chai
            .request(app)
            .post(`/${context}/${version}/verificarOtp`)
            .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
            .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
            .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": false })
            .end((err, res) => {
              res.should.have.status(214)
              done()
            })
        })
      })
      describe('T5.2. Cuenta bloqueada con eventos invalidos.', () => {
        before('Configuración inicial de cuenta del cliente.', async () => {
          await testHelpers.reiniciarCliente()
          await testHelpers.bloquearClienteConEnviosOtp()
        })
        it('Enviar OTP por EMAIL', done => {
          chai
            .request(app)
            .post(`/${context}/${version}/verificarOtp`)
            .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
            .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
            .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": false })
            .end((err, res) => {
              res.should.have.status(203)
              done()
            })
        })
      })
  })
})