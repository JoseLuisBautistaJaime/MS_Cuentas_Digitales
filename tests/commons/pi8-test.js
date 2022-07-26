/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */

import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../../src/server'
import { log } from './pi8-test-log'

/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let defaultUrl
let defaultBody
let defaultListHeaders
let defaultShouldHaveStatus

const setterDefaultOptions = defaultOptions => {
  if (typeof defaultOptions === 'undefined') return
  if (defaultOptions.defaultUrl !== undefined) defaultUrl = defaultOptions.defaultUrl
  if (defaultOptions.defaultBody !== undefined) defaultBody = defaultOptions.defaultBody
  if (defaultOptions.defaultListHeaders !== undefined) defaultListHeaders = defaultOptions.defaultListHeaders
  if (defaultOptions.defaultShouldHaveStatus !== undefined) defaultShouldHaveStatus = defaultOptions.defaultShouldHaveStatus
}

// eslint-disable-next-line camelcase
const createIT_createCHAI = (url, requestMethod) => {
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

export const createIT = (testKey, testTitle, options, requestMethod) => {
  const testDesc = `${testKey}-${testTitle}`
  // LECTURA DE LAS OPCIONES

  options = typeof options === 'undefined' ? {} : options

  if (defaultUrl !== undefined && options.url === undefined) options.url = defaultUrl
  if (defaultBody !== undefined && options.body === undefined) options.body = defaultBody
  if (defaultListHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = defaultListHeaders
  if (defaultShouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = defaultShouldHaveStatus

  // LECTURA..
  it(testDesc, done => {
    const testChai = createIT_createCHAI(options.url, requestMethod)
    log.reMark(JSON.stringify(options.listHeaders))
    if (typeof options.listHeaders !== 'undefined') options.listHeaders.forEach(header => testChai.set(header.name, header.value))
    if (testTitle !== undefined) testChai.set('testTitle', testTitle)
    testChai.send(options.body)
    testChai.end((err, res) => {
      if (options.shouldHaveStatus !== undefined) res.should.have.status(options.shouldHaveStatus)
      done()
    })
  })
}

export const SuiteTEST = async (key, title, defaultOptions, callbackBEFORE, callbackAFTER, callbakTESTS) => {
  setterDefaultOptions(defaultOptions)
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