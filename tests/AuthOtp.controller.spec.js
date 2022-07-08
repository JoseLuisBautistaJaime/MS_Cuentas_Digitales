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
// import { URL_API_COMUNICACIONES } from '../src/commons/constants'


const TEST_HEADER_AUTHORIZATION = 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM='
const TEST_HEADER_IDCONSUMIDOR = 25
const TEST_HEADER_IDDESTINO = 14
const TEST_HEADER_USUARIO = 'midas'
const TEST_HEADER_AUTHBEARER = '2479ryefiudh='

const TEST_CLIENTE = '9999'
const TEST_CLIENTE_DATA = {
  "idCliente" : "1199",
  "idDevice": "74312734d5403d54",
  "tarjetaMonte" : "11111",
  "nombreCliente" : "ricoff",
  "apellidoPaterno" : "CARRILLO",
  "apellidoMaterno" : "LOPEZF",
  "correoCliente": "rigocl@hotmail.com",
  "celularCliente": "6731143889"
}

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server


chai.use(chaiHttp).use(chaiAsPromised).should()
describe('Comuinicaciones', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
    ClienteService.removerCliente(TEST_CLIENTE)
    ClienteService.actualizarCliente(TEST_CLIENTE_DATA)
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })

  const requestEnvarOtpEmailBody = {
    idCliente : TEST_CLIENTE,
    "modoEnvio": "email"
  }

  /** TEST #1-Remover cliente en caso de que exista */

  it('Enviar OTP por EMAIL', done => {
    nock(URL_API_COMUNICACIONES)
      .post('/api/comunicacion/v1/solicitud/mensaje')
      .reply(201, {})
    chai
      .request(app)
      .post(`/${context}/${version}/enviarOtp`)
      .set('Authorization', TEST_HEADER_AUTHORIZATION)
      .set('idConsumidor', TEST_HEADER_IDCONSUMIDOR)
      .set('idDestino', TEST_HEADER_IDDESTINO)
      .set('usuario', TEST_HEADER_USUARIO)
      .set('oauth.bearer', TEST_HEADER_AUTHBEARER)
      .send(requestEnvarOtpEmailBody)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

})
