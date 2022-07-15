/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../src/commons/connection'
import { ClienteService } from '../src/services/Cliente.Service'
import { testHelpers, HEADER, TEST_CLIENTE, TEST_CLIENTE_DATA } from './testHelpers'

import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server

chai.use(chaiHttp).use(chaiAsPromised).should()
describe('T4.Cliente.Controller', () => {
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
  
  describe('T4. Cliente metodos básicos.', () => {
    it('T4.0-actualizarCliente, con headers incompletos.', done => {
      chai
        .request(app)
        .post(`/${context}/${version}/actualizarCliente`)
        .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
        .set('TestTag','T3A.0-VerificarOTP, con headers incompletos.') 
        .send({ "idCliente": TEST_CLIENTE, "codigoOtp": '0000', "enviaremail": true })
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })

    // it('T4A.1-actualizarCliente, cuando el cliente NO EXISTE.', done => {
    //   chai
    //     .request(app)
    //     .post(`/${context}/${version}/actualizarCliente`)
    //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
    //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
    //     .set('TestTag','T4A.1-actualizarCliente, cuando el cliente NO EXISTE.') 
    //     .send(TEST_CLIENTE_DATA)
    //     .end((err, res) => {
    //       res.should.have.status(200)
    //       done()
    //     })
    // })

    // it('T4A.2-actualizarCliente, cuando el cliente SI EXISTE.', done => {
    //   chai
    //     .request(app)
    //     .post(`/${context}/${version}/actualizarCliente`)
    //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
    //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
    //     .set('TestTag','T4A.1-actualizarCliente, cuando el cliente SI EXISTE.') 
    //     .send(TEST_CLIENTE_DATA)
    //     .end((err, res) => {
    //       res.should.have.status(200)
    //       done()
    //     })
    // })

    // it('T4A.3-obtenerCliente, con parametro valido.', done => {
    //   chai
    //     .request(app)
    //     .get(`/${context}/${version}/obtenerCliente`)
    //     .query({idCliente:TEST_CLIENTE})
    //     .set('Authorization', HEADER.AUTHORIZATION).set('oauth.bearer', HEADER.AUTHBEARER)  
    //     .set('idConsumidor', HEADER.IDCONSUMIDOR).set('idDestino', HEADER.IDDESTINO).set('usuario', HEADER.USUARIO)
    //     .set('TestTag','T4A.3-obtenerCliente, cuando el cliente SI EXISTE.') 
    //     .end((err, res) => {
    //       res.should.have.status(200)
    //       done()
    //     })
    // })
  })
})