/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { log } from '../../src/commons/log'
import app from '../../src/server'
import { filterbySuiteTest, filterbyTest } from "./test-constants"

/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let DefaultOption = {}
let DefaultSub = {}
let ListDefaultOption = {}
let ListDefaultSub = {}

export const XPos = {
  readFirst: (list, sep) => {
    if (sep === undefined) sep =','
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return list
    return String(list).substring(0, indexPos)
  },
  removeFirst: (list, sep) => {
    if (sep === undefined) sep =','
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return ''
    return String(list).substring(indexPos+String(sep).length)
  },
  existItem: (list, itemFind,sep) => {
    if (sep === undefined) sep =','
    if (list === undefined || itemFind === undefined || list ==='' || itemFind === '') return false

    while(true) {
      const cursorItem = XPos.readFirst(list,sep)
      list = XPos.removeFirst(list, sep)
      if (cursorItem !== '' && cursorItem === itemFind) return true
      if (list === '') return false
    }
  }


}

const runSubsFromList = async (listSubs, filterSub) => {
  while(true) {
    const itemSub = XPos.readFirst(listSubs)
    listSubs = XPos.removeFirst(listSubs)
    if (itemSub === '') return
      const canRun = (String(itemSub).indexOf(filterSub) !== -1)
      if (canRun) {
        log.reMark(`--runSub ${filterSub}`, DefaultSub[itemSub].title)
        await DefaultSub[itemSub].sub()
      }
  }
}


export const SuiteTEST = async (key, title, configs, callbacks) => {
  // DefaultOptions = typeof defaultOptions === 'undefined' ? {} : defaultOptions
    if (configs !== undefined && configs.listDefaultOption !== undefined) ListDefaultOption[key] = configs.listDefaultOption
    if (configs !== undefined && configs.listDefaultSub !== undefined) ListDefaultSub[key] = configs.listDefaultSub
    log.reFatal(`PASO#1 SuiteTest: ${key}`)
    log.reFatal(`PASO#1 ListDefaultSub: ${JSON.stringify(ListDefaultSub)}`)
    log.reFatal(`PASO#1 ListDefaultOption: ${JSON.stringify(ListDefaultOption)}`)
    if (filterbySuiteTest !== undefined && filterbySuiteTest !=='') {
      const ipos = String(key).indexOf(filterbySuiteTest)
      if (ipos === -1) return
    }

      
      describe(title, () => {
        // eslint-disable-next-line mocha/no-hooks-for-single-case
        before(async () => {
          if(typeof callbacks !=='undefined' && typeof callbacks.before !== 'undefined')  {
            await callbacks.before()
          }})
        // eslint-disable-next-line mocha/no-hooks-for-single-case
        after(async () => {
          if(typeof callbacks !=='undefined' && typeof callbacks.after !== 'undefined')  {
            await callbacks.after()
          }
        })
        callbacks.tests()
      })
  
}




export const itREQUEST = (method, testKey, testTitle, options, callbacks) => {
  const testDesc = `${testKey}-${testTitle}`
  // LECTURA DE LAS OPCIONES
  options = typeof options === 'undefined' ? {} : options
  

  if (filterbyTest !== undefined && filterbyTest !== '') {
    const existTest = XPos.existItem(filterbyTest,testKey) 
    if (!existTest) return
  }
  
  
  describe(testKey, () => {
    before(async ()=> {
        const keySuite = String(testKey).substring(0,3)
        
        if (options !== undefined && options.useOption) DefaultOption = ListDefaultOption[keySuite][options.useOption]
        if (options !== undefined && options.useOption) DefaultSub = ListDefaultSub[keySuite]

        
        log.reMark('Iniciando-IT-BEFORE',DefaultOption)

        if (options.defaultOption !== undefined) DefaultOption = options.defaultOption
        if (DefaultOption.url !== undefined && options.url === undefined) options.url = DefaultOption.url
        if (DefaultOption.query !== undefined && options.query === undefined) options.query = DefaultOption.query
        if (DefaultOption.body !== undefined && options.body === undefined) options.body = DefaultOption.body
        if (DefaultOption.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOption.listHeaders
        if (DefaultOption.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = DefaultOption.shouldHaveStatus
      const existRunSubs = (options !==undefined && options.runSubs !== undefined)
      const existCallbacks = (callbacks !==undefined && callbacks.before !== undefined)
      if (existRunSubs || existCallbacks) {
        log.reMark('Iniciando-IT-BEFORE')
        if (existCallbacks) await callbacks.before()
        if (existRunSubs) await runSubsFromList(options.runSubs,'before')
        log.reMark('Terminando-IT-BEFORE')
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
          if (callbacks !== undefined && callbacks.end !== undefined) callbacks.end(err,res)
          done()
        })
      })
  })
}
export const IT = {
  Post: async (testKey, testTitle, options, callbacks) => itREQUEST('post', testKey, testTitle, options, callbacks),
  Get: async (testKey, testTitle, options, callbacks) => itREQUEST('get', testKey, testTitle, options, callbacks),
  Delete: async (testKey, testTitle, options, callbacks) => itREQUEST('delete', testKey, testTitle, options, callbacks)
}


