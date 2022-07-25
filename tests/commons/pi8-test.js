/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../../src/server'
import { log } from './pi8-test-log'

let repiteURL
let repiteBODY
let repiteOAG

// eslint-disable-next-line camelcase
export const createIT_createCHAI = (url, requestMethod) => {
  let testChai = chai.request(app)
  switch (requestMethod) {
    case 'post':
      testChai = testChai.post(url)
      break
    case 'get':
      testChai = testChai.get(url)
      break
    default:
  }
  return testChai
}
chai.use(chaiHttp).use(chaiAsPromised).should()
export const createIT = (testKey, testTitle, options, requestMethod, listHeaders) => {
  const { shouldHaveStatus } = options
  const testDesc = `${testKey}-${testTitle}`

  // LECTURA DE LAS OPCIONES
  let { oag, url, body } = options
  if (options.repiteURL !== undefined) repiteURL = options.repiteURL
  if (options.repiteBODY !== undefined) repiteBODY = options.repiteBODY
  if (options.repiteOAG !== undefined) repiteOAG = options.repiteOAG
  if (repiteURL !== undefined && url === undefined) url = repiteURL
  if (repiteBODY !== undefined && body === undefined) body = repiteBODY
  if (repiteOAG !== undefined && oag === undefined) oag = repiteOAG
  if (oag === undefined && repiteOAG === undefined) oag = true

  // LECTURA..

  it(testDesc, done => {
    const testChai = createIT_createCHAI(url, requestMethod)
    if (typeof listHeaders !== 'undefined') listHeaders.forEach(header => testChai.set(header.name, header.value))
    if (testTitle !== undefined) testChai.set('testTitle', testTitle)
    testChai.send(body)
    testChai.end((err, res) => {
      if (shouldHaveStatus !== undefined) res.should.have.status(shouldHaveStatus)
      done()
    })
  })
}

export const SuiteTEST = async (key, title, callbackBEFORE, callbackAFTER, callbakTESTS) => {
  describe(title, () => {
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    before(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-BEFORE')
      await callbackBEFORE()
      log.reMark('Terminando-SuiteTest-BEFORE')
    })
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    after(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-AFTER')
      await callbackAFTER()
      log.reMark('Terminando-SuiteTest-AFTER')
    })
    callbakTESTS()
  })
}

export const itPOST = (testKey, testTitle, options, listHeaders) => createIT(testKey, testTitle, options, 'post', listHeaders)