/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../src/commons/connection'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION

let mongo
let server

chai.use(chaiHttp).use(chaiAsPromised).should()

describe('POST /actualizarCliente', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })
  it('Actualizar la información del cliente', done => {
    const requestBody = {
      idCliente: '1111',
      idDevice: '23231',
      tarjetaMonte: '3424234',
      nombreCliente: 'Julio',
      apellidoPaterno: 'Soto',
      apellidoMaterno: 'Perez',
      correoCliente: 'jsoto@quarksoft.net',
      celularCliente: '4927952196'
    }
    chai
      .request(app)
      .post(`/${context}/${version}/actualizarCliente`)
      .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
      .set('idConsumidor', '1')
      .set('idDestino', '1')
      .set('usuario', '1')
      .set('oauth.bearer', '2479ryefiudh=')
      .send(requestBody)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
  // it('Actualizar la información del cliente - Error header', done => {
  //   const requestBody = {
  //     idCliente: '1111',
  //     idDevice: '23231',
  //     tarjetaMonte: '3424234',
  //     nombreCliente: 'Julio',
  //     apellidoPaterno: 'Soto',
  //     apellidoMaterno: 'Perez',
  //     correoCliente: 'jsoto@quarksoft.net',
  //     celularCliente: '4927952196'
  //   }
  //   chai
  //     .request(app)
  //     .post(`/${context}/${version}/actualizarCliente`)
  //     .send(requestBody)
  //     .end((err, res) => {
  //       res.should.have.status(400)
  //       done()
  //     })
  // })
})
