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
// import { OAuthService } from "./commons/OAuth.service"


// tests\commons\OAuth.service.js
// import { ClienteService } from '../services/Cliente.Service'

const context = CONTEXT_NAME
const version = CONTEXT_VERSION


 // let xxFFF = OAuthService
let mongo
let server
// let oauthToken 



// nock('https://iamdr.montepiedad.com.mx:4444/api/comunicacion/v1/solicitud/mensaje')
//   .post('/solicitud/mensaje')
//   .reply(200)

  // const HttpComunicaciones = {
  //   url: `${ URL_API_COMUNICACIONES}/solicitud/mensaje`,
  //   method: HttpMethod.POST,
  //   headers: header,
  //   body: bodyComunicaciones
  // }

chai.use(chaiHttp).use(chaiAsPromised).should()
describe('Comuinicaciones', () => {
  before('Create Connection to DB', async () => {
    server = await getMongoConnectionString()
    mongo = await createConnection()
    // nock('https://iamdr.montepiedad.com.mx:4444/api/comunicacion/v1/solicitud/mensaje')
    // .post('')
    // .reply(200)
  })
  after('Close Connection to DB', async () => {
    mongo.disconnect()
    server.stop()
  })


  const idCliente = '9999'
  // const oauthBearer = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6Im9yYWtleSJ9.eyJzdWIiOiJtaWRhcyIsImlzcyI6Ind3dy5vcmFjbGUuZXhhbXBsZS5jb20iLCJvcmFjbGUub2F1dGguc3ZjX3BfbiI6Ik9BdXRoU2VydmljZVByb2ZpbGUiLCJpYXQiOjE2NTY0NDMxNTIwMDAsIm9yYWNsZS5vYXV0aC5wcm4uaWRfdHlwZSI6IkNsaWVudElEIiwiZXhwIjoxNjU2NDQ2NzUyMDAwLCJvcmFjbGUub2F1dGgudGtfY29udGV4dCI6InJlc291cmNlX2FjY2Vzc190ayIsInBybiI6Im1pZGFzIiwianRpIjoiZWQ3YmUyOGUtYzE1ZC00MzJmLTg4MmUtMDAwOGQyYjViY2Q4Iiwib3JhY2xlLm9hdXRoLmNsaWVudF9vcmlnaW5faWQiOiJtaWRhcyIsIm9yYWNsZS5vYXV0aC5zY29wZSI6IlVzZXJQcm9maWxlLm1lIiwidXNlci50ZW5hbnQubmFtZSI6IkRlZmF1bHREb21haW4iLCJvcmFjbGUub2F1dGguaWRfZF9pZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMiJ9.e9-2G4qYR5eKuHev4_W3kflIK2Ii7MIbo8m1dXO0chNM5LwFBWH1sIK1EaqSGc-twsNKJjbQB7rqB6znujmWEyppQrsYMn_1Vllp51E4iJudK6V_97Pq1P7yvrTo7X-Ny77eZ3WQbGufFRtJy3f_B2KtYaPhytFHdjQkBGuDq64'
  const requestEnvarOtpSmsBody = {
    idCliente,
    "modoEnvio": "sms"
  }

  const requestEnvarOtpEmailBody = {
    idCliente,
    "modoEnvio": "email"
  }

  // const requestClienteBody = {
  //   idCliente,
  //   idDevice: '23231',
  //   tarjetaMonte: '3424234',
  //   nombreCliente: 'Julio',
  //   apellidoPaterno: 'Soto',
  //   apellidoMaterno: 'Perez',
  //   correoCliente: 'jsoto@quarksoft.net',
  //   celularCliente: '4927952196'
  // }




  /** TEST #0-Clreacion de cliente para probar Activacion */
  // it('Actualizar la información del cliente-Creando un nuevo registro', done => {
  //   chai
  //     .request(app)
  //     .post(`/${context}/${version}/actualizarCliente`)
  //     .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
  //     .set('idConsumidor', '1')
  //     .set('idDestino', '1')
  //     .set('usuario', '1')
  //     .set('oauth.bearer', '2479ryefiudh=')
  //     .send(requestClienteBody)
  //     .end((err, res) => {
  //       res.should.have.status(200)
  //       done()
  //     })
  // })




  /** TEST #1-Remover cliente en caso de que exista */
  it('Enviar OTP por SMS', done => {
      nock('https://iamdr.montepiedad.com.mx:4444')
      .post('/api/comunicacion/v1/solicitud/mensaje',{})  
    // .post('',{ 'neta' : 'neta' })
      .reply(200, { codigoOtp : '1234' })
    chai
      .request(app)
      .post(`/${context}/${version}/enviarOtp`)
      .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
      .set('idConsumidor', '25')
      .set('idDestino', '14')
      .set('usuario', 'midas')
      .set('oauth.bearer', '2479ryefiudh=')
      .send(requestEnvarOtpSmsBody)
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

    /** TEST #1-Remover cliente en caso de que exista */
    // it('Enviar OTP por EMAIL', done => {
    //   chai
    //     .request(app)
    //     .post(`/${context}/${version}/enviarOtp`)
    //     .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
    //     .set('idConsumidor', '25')
    //     .set('idDestino', '14')
    //     .set('usuario', 'midas')
    //     .set('oauth.bearer', '2479ryefiudh=')
    //     .send(requestEnvarOtpEmailBody)
    //     .end((err, res) => {
    //       res.should.have.status(200)
    //       done()
    //     })
    // })

})
