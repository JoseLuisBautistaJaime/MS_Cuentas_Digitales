/* eslint-disable no-param-reassign */
/* eslint-disable mocha/no-setup-in-describe */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { HEADER } from './testHelpers'
import app from '../../src/server'
import { LOG } from '../../src/commons'

chai.use(chaiHttp).use(chaiAsPromised).should()

let repiteURL
let repiteBODY
let repiteOAG

export const genCHAI = options => {
  const { testTitle } = options
  let { oag, url, body } = options
  if (options.repiteURL !== undefined) repiteURL = options.repiteURL
  if (options.repiteBODY !== undefined) repiteBODY = options.repiteBODY
  if (options.repiteOAG !== undefined) repiteOAG = options.repiteOAG
  if (repiteURL !== undefined && url === undefined) url = repiteURL
  if (repiteBODY !== undefined && body === undefined) body = repiteBODY
  if (repiteOAG !== undefined && oag === undefined) oag = repiteOAG
  if (oag === undefined && repiteOAG === undefined) oag = true
  let testchai = chai.request(app).post(url)
  if (oag) {
    testchai = testchai
      .set('Authorization', HEADER.AUTHORIZATION)
      .set('oauth.bearer', HEADER.AUTHBEARER)
      .set('idConsumidor', HEADER.IDCONSUMIDOR)
      .set('idDestino', HEADER.IDDESTINO)
      .set('usuario', HEADER.USUARIO)
  }
  if (testTitle !== undefined) testchai.set('testTitle', testTitle)
  return testchai.send(body)
}

export const itPOST = (testKey, testTitle, options) => {
  const { shouldHaveStatus } = options
  options.testKey = testKey
  options.testTitle = testTitle
  const testDesc = `${testKey}-${testTitle}`
  it(testDesc, done => {
    genCHAI(options).end((err, res) => {
      if (shouldHaveStatus !== undefined) res.should.have.status(shouldHaveStatus)
      done()
    })
  })
}
