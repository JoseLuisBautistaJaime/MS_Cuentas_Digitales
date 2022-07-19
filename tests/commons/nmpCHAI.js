import chai from 'chai'
import { HEADER } from './testHelpers'
import app from '../../src/server'
import { getMongoConnectionString } from './mongodb'
import { createConnection } from '../../src/commons/connection'

let repiteURL
let repiteBODY
let repiteOAG
// before('rootBEFORE', async () => CHAI.rootBEFORE())
// after('rootAFTER', async () => CHAI.rootAFTER())
export const itPOST = options => {
  const { testTag, shouldHaveStatus } = options
  let { oag, url, body } = options
  if (options.repiteURL !== undefined) repiteURL = options.repiteURL
  if (options.repiteBODY !== undefined) repiteBODY = options.repiteBODY
  if (options.repiteOAG !== undefined) repiteOAG = options.repiteOAG
  if (repiteURL !== undefined && url === undefined) url = repiteURL
  if (repiteBODY !== undefined && body === undefined) body = repiteBODY
  if (repiteOAG !== undefined && oag === undefined) oag = repiteOAG
  if (oag === undefined && repiteOAG === undefined) oag = true

  it(testTag, done => {
    let testchai = chai.request(app).post(url)

    if (oag) {
      testchai = testchai
        .set('Authorization', HEADER.AUTHORIZATION)
        .set('oauth.bearer', HEADER.AUTHBEARER)
        .set('idConsumidor', HEADER.IDCONSUMIDOR)
        .set('idDestino', HEADER.IDDESTINO)
        .set('usuario', HEADER.USUARIO)
    }
    if (testTag !== undefined) testchai.set('TestTag', testTag)
    if (body !== undefined)
      testchai.send(body).end((err, res) => {
        if (shouldHaveStatus !== undefined) res.should.have.status(shouldHaveStatus)
        done()
      })
  })
}

/** configuracion de conexion */
let mongo
let server
export const rootBEFORE = async () => {
  server = await getMongoConnectionString()
  mongo = await createConnection()
}

export const rootAFTER = async () => {
  mongo.disconnect()
  server.stop()
}

export const nmpCHAI = {
  itPOST,
  rootBEFORE,
  rootAFTER
}
