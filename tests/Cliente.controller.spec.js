// /* eslint-disable prettier/prettier */
// import chai from 'chai'
// import chaiHttp from 'chai-http'
// import chaiAsPromised from 'chai-as-promised'
// import app from '../src/server'
// import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'
// import { getMongoConnectionString } from './mongodb'
// import { createConnection } from '../src/commons/connection'


// const context = CONTEXT_NAME
// const version = CONTEXT_VERSION

// const idCliente = '9999'

// let mongo
// let server


// chai.use(chaiHttp).use(chaiAsPromised).should()

// describe('POST /actualizarCliente', () => {
//   before('Create Connection to DB', async () => {
//     server = await getMongoConnectionString()
//     mongo = await createConnection()
//   })
//   after('Close Connection to DB', async () => {
//     mongo.disconnect()
//     server.stop()
//   })

//   /** TEST #1-Remover cliente en caso de que exista */
//   it('Remover cliente en caso de que exista alguno', done => {
//     chai
//       .request(app)
//       .post(`/${context}/${version}/removerCliente?idCliente=${idCliente}`)
//       .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
//       .set('idConsumidor', '1')
//       .set('idDestino', '1')
//       .set('usuario', '1')
//       .set('oauth.bearer', '2479ryefiudh=')
//       .end((err, res) => {
//         res.should.have.status(200)
//         done()
//       })
//   })

//   const requestClienteBody = {
//     idCliente,
//     idDevice: '23231',
//     tarjetaMonte: '3424234',
//     nombreCliente: 'Julio',
//     apellidoPaterno: 'Soto',
//     apellidoMaterno: 'Perez',
//     correoCliente: 'jsoto@quarksoft.net',
//     celularCliente: '4927952196'
//   }


//   /** TEST #1-Remover cliente en caso de que exista */
//   it('Actualizar la información del cliente-Creando un nuevo registro', done => {
//     chai
//       .request(app)
//       .post(`/${context}/${version}/actualizarCliente`)
//       .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
//       .set('idConsumidor', '1')
//       .set('idDestino', '1')
//       .set('usuario', '1')
//       .set('oauth.bearer', '2479ryefiudh=')
//       .send(requestClienteBody)
//       .end((err, res) => {
//         res.should.have.status(200)
//         done()
//       })
//   })

//   /** TEST #2 */
//   it('Actualizar la información del cliente-Actualizando un nuevo registro', done => {
//     chai
//       .request(app)
//       .post(`/${context}/${version}/actualizarCliente`)
//       .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
//       .set('idConsumidor', '1')
//       .set('idDestino', '1')
//       .set('usuario', '1')
//       .set('oauth.bearer', '2479ryefiudh=')
//       .send(requestClienteBody)
//       .end((err, res) => {
//       res.should.have.status(200)
//       done()
//     })
//   })

//   //* TEST #4 */
//   it('Consultar la información del cliente', done => {
//   chai
//     .request(app)
//     .get(`/${context}/${version}/obtenerCliente?idCLiente=${idCliente}`)
//     .set('Authorization', 'Basic bWlkYXM6c3NLaWU2MTN1NXUzUUVPbmRrSDM=')
//     .set('idConsumidor', '1')
//     .set('idDestino', '1')
//     .set('usuario', '1')
//     .set('oauth.bearer', '2479ryefiudh=')
//     .send()
//     .end((err, res) => {
//       res.should.have.status(200)
//       done()
//     })
// })
// })
