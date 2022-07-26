/* eslint-disable prettier/prettier */
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
let DefaultOptions = {}

export const SuiteTEST = async (key, title, defaultOptions, callbacks) => {
  DefaultOptions = typeof defaultOptions === 'undefined' ? {} : defaultOptions
  describe(title, () => {
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    before(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-BEFORE')
      await callbacks.before()
      log.reMark('Terminando-SuiteTest-BEFORE')
    })
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    after(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-AFTER')
      await callbacks.after()
      log.reMark('Terminando-SuiteTest-AFTER')
    })
    callbacks.tests()
  })
}

export const createIT = (testKey, testTitle, options, requestMethod) => {
  const testDesc = `${testKey}-${testTitle}`
  // LECTURA DE LAS OPCIONES

  options = typeof options === 'undefined' ? {} : options
 
  if (DefaultOptions.testIgnore !== undefined && options.testIgnore === undefined) options.testIgnore = DefaultOptions.testIgnore
  if (DefaultOptions.url !== undefined && options.url === undefined) options.url = DefaultOptions.url
  if (DefaultOptions.body !== undefined && options.body === undefined) options.body = DefaultOptions.body
  if (DefaultOptions.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOptions.listHeaders
  if (DefaultOptions.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = DefaultOptions.shouldHaveStatus

  if (options.testIgnore) {
    log.reMark(`Test Ignored: ${testDesc}`)
    return
  }
  

  // LECTURA..
  it(testDesc, done => {
    let testChai = chai.request(app)
    if (requestMethod === 'post') testChai = testChai.post(options.url)
    if (requestMethod === 'get') testChai = testChai.get(options.url)
    if (typeof options.listHeaders !== 'undefined') options.listHeaders.forEach(header => testChai.set(header.name, header.value))
    if (testTitle !== undefined) testChai.set('testTitle', testTitle)
    testChai.send(options.body)
    testChai.end((err, res) => {
      if (options.shouldHaveStatus !== undefined) res.should.have.status(options.shouldHaveStatus)
      done()
    })
  })
}

export const itPOST = (testKey, testTitle, options, listHeaders) => createIT(testKey, testTitle, options, 'post', listHeaders)