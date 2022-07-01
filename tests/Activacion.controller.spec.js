/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION, URL_API_COMUNICACIONES } from '../src/commons/constants'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../src/commons/connection'
// import { URL_API_COMUNICACIONES } from '../src/commons/constants'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server


chai.use(chaiHttp).use(chaiAsPromised).should()
describe('Comuinicaciones', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })


  const idCliente = '9999'
  const requestEnvarOtpEmailBody = {
    idCliente,
    "modoEnvio": "email"
  }


  /** TEST #1-Remover cliente en caso de que exista */
  it('Enviar OTP por SMS', done => {
      nock('https://iamdr.montepiedad.com.mx:4444')
      .post('/api/comunicacion/v1/solicitud/mensaje',{})  
      .reply(200, { codigoOtp : '1234' })
    chai
      .request(app)
      .post(`/${context}/${version}/enviarOtp`)
      .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
      .set('idConsumidor', '25')
      .set('idDestino', '14')
      .set('usuario', 'midas')
      .set('oauth.bearer', '2479ryefiudh=')
      .send(requestEnvarOtpEmailBody)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

})
