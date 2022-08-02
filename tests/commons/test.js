/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable mocha/no-hooks-for-single-case */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-param-reassign */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { log } from '../../src/commons/log'
import app from '../../src/server'
import { filterbySuiteTest, filterbyTest } from './test-constants'

/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let DefaultOption = {}
let DefaultSub = {}
const ListDefaultOption = {}
const ListDefaultSub = {}
const ListCommon = {}

export const XList = {
  readFirst: (list, sep) => {
    if (sep === undefined) sep = ','
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return list
    return String(list).substring(0, indexPos)
  },
  removeFirst: (list, sep) => {
    if (sep === undefined) sep = ','
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return ''
    return String(list).substring(indexPos + String(sep).length)
  },
  existItem: (list, itemFind, sep) => {
    if (sep === undefined) sep = ','
    if (list === undefined || itemFind === undefined || list === '' || itemFind === '') return false
    while (true) {
      const cursorItem = XList.readFirst(list, sep)
      list = XList.removeFirst(list, sep)
      if (cursorItem !== '' && cursorItem === itemFind) return true
      if (list === '') return false
    }
  }
}

const runSubsFromList = async (listSubs, filterSub) => {
  while (true) {
    const itemSub = XList.readFirst(listSubs)
    listSubs = XList.removeFirst(listSubs)
    if (itemSub === '') return
    const canRun = String(itemSub).indexOf(filterSub) !== -1
    if (canRun) await DefaultSub[itemSub].sub()
  }
}

export const SuiteTEST = async (key, title, configs, callbacks) => {
  if (configs !== undefined) {
    ListDefaultOption[key] = configs.listDefaultOption
    ListDefaultSub[key] = configs.listDefaultSub
    ListCommon[key] = { commonHeaders: configs.commonHeaders, commonRootUrl: configs.commonRootUrl }
  }
  if (filterbySuiteTest !== undefined && filterbySuiteTest !=='') {
    const ipos = String(key).indexOf(filterbySuiteTest)
    if (ipos === -1) return
  }
  describe(title, () => {
    before(async () => {
      if (callbacks !== undefined && callbacks.before !== undefined) await callbacks.before()
    })
    after(async () => {
      if (callbacks !== undefined && callbacks.after !== undefined) await callbacks.after()
    })
    callbacks.tests()
  })
}

export const itREQUEST = (method, keyTest, keyOption, testTitle, options, callbacks) => {
  // LECTURA DE LAS OPCIONES
  options = options === undefined ? {} : options

  // Extraer KeyTest y Evaluar el Filtro
  const keySUITE = String(keyTest).substring(0, 3)
  if (filterbyTest !== undefined && filterbyTest !== '') {
    const existTest = XList.existItem(filterbyTest, keyTest, ':')
    if (!existTest) return
  }
  const testDesc = `${keyTest}-${testTitle}`

  describe(keyTest, () => {
    before(async () => {
      // Definiendo las configuraciones de SuiteTest..
      const optTEST = XList.readFirst(keyOption, ':')
      const statusTEST = XList.removeFirst(keyOption, ':')
      if (optTEST !== '') DefaultOption = ListDefaultOption[keySUITE][optTEST]
      if (options !== undefined && options.run) DefaultSub = ListDefaultSub[keySUITE]

      // Definicion del statusRuest
      if (statusTEST !== '') DefaultOption.shouldHaveStatus = Number(statusTEST)
      if (DefaultOption.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined)
        options.shouldHaveStatus = DefaultOption.shouldHaveStatus
      if (DefaultOption.url !== undefined && options.url === undefined) options.url = DefaultOption.url
      if (ListCommon[keySUITE].commonRootUrl !== undefined) options.url = `${ListCommon[keySUITE].commonRootUrl}${options.url}`
      if (DefaultOption.query !== undefined && options.query === undefined) options.query = DefaultOption.query
      if (DefaultOption.body !== undefined && options.body === undefined) options.body = DefaultOption.body
      if (ListCommon[keySUITE].commonHeaders !== undefined && DefaultOption.listHeaders === undefined)
        DefaultOption.listHeaders = ListCommon[keySUITE].commonHeaders
      if (DefaultOption.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOption.listHeaders

      // Ejecicion de callbaks y runs
      const existRun = options !== undefined && options.run !== undefined
      const existCallbacks = callbacks !== undefined && callbacks.before !== undefined
      if (existRun || existCallbacks) {
        if (existCallbacks) await callbacks.before()
        if (existRun) await runSubsFromList(options.run, 'before')
      }
    })
    it(testDesc, done => {
      let testChai = chai.request(app)
      if (method === 'post') testChai = testChai.post(options.url)
      if (method === 'get') testChai = testChai.get(options.url)
      if (method === 'delete') testChai = testChai.delete(options.url)
      if (typeof options.listHeaders !== 'undefined') options.listHeaders.forEach(header => testChai.set(header.name, header.value))
      if (testDesc !== undefined) testChai.set('testDesc', testDesc)
      if (options.query !== undefined) testChai.query(options.query)
      if (callbacks !== undefined && callbacks.send !== undefined) options.body = callbacks.send()
      testChai.send(options.body)
      testChai.end((err, res) => {
        if (options.shouldHaveStatus !== undefined) res.should.have.status(options.shouldHaveStatus)
        if (callbacks !== undefined && callbacks.end !== undefined) {
          callbacks.end(err, res)
        }
        done()
      })
    })
  })
}
export const IT = {
  Post: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('post', keyTest, keyOption, testTitle, options, callbacks),
  Get: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('get', keyTest, keyOption, testTitle, options, callbacks),
  Delete: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('delete', keyTest, keyOption, testTitle, options, callbacks)
}
