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


/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let DefaultOptions = {}

export const SuiteTEST = async (key, title, options, callbacks) => {
  // DefaultOptions = typeof defaultOptions === 'undefined' ? {} : defaultOptions
    if (options !== undefined && options.suiteTestIgnore === true) {}
    else {
      describe(title, () => {
        // eslint-disable-next-line mocha/no-hooks-for-single-case
        before(async () => {
          log.reMark(`Iniciando-SuiteTEST`, title)
          if(typeof callbacks !=='undefined' && typeof callbacks.before !== 'undefined')  {
            log.reMark('Iniciando-SuiteTest-BEFORE') 
            await callbacks.before()
            log.reMark('Terminando-SuiteTest-BEFORE')
          }})
        // eslint-disable-next-line mocha/no-hooks-for-single-case
        after(async () => {
          if(typeof callbacks !=='undefined' && typeof callbacks.after !== 'undefined')  {
            log.reMark('Iniciando-SuiteTest-AFTER')
            await callbacks.after()
            log.reMark('Terminando-SuiteTest-AFTER')
          }
          log.reMark(`Terminando-SuiteTEST`, title)
        })
        callbacks.tests()
      })
  }
}

export const itREQUEST = (method, testKey, testTitle, options, callbacks) => {
  const testDesc = `${testKey}-${testTitle}`
  // LECTURA DE LAS OPCIONES
  options = typeof options === 'undefined' ? {} : options
  if (options !== undefined && options.testIgnore) {
     log.reWarn(`Test Ignored: ${testDesc}`)  
     return
  }
  
  describe(testKey, () => {
    before(async ()=> {
        if (options.defaultOptions !== undefined) DefaultOptions = options.defaultOptions
        if (DefaultOptions.testIgnore !== undefined && options.testIgnore === undefined) options.testIgnore = DefaultOptions.testIgnore
        if (DefaultOptions.url !== undefined && options.url === undefined) options.url = DefaultOptions.url
        if (DefaultOptions.query !== undefined && options.query === undefined) options.query = DefaultOptions.query
        if (DefaultOptions.body !== undefined && options.body === undefined) options.body = DefaultOptions.body
        if (DefaultOptions.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOptions.listHeaders
        if (DefaultOptions.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = DefaultOptions.shouldHaveStatus
      if(typeof callbacks !=='undefined' && typeof callbacks.before !== 'undefined') {
        log.reMark('Iniciando-IT-BEFORE')
        await callbacks.before()
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


