/* eslint-disable prettier/prettier */
/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import log4JS from 'log4js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import app from '../../src/server'

/** SECCION DE LOG */
log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-10.10c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

export const LOG = log4JS.getLogger('tests')
LOG.level = 'debug'

const genMessage = (message, _json, colorStyle) => {
  if (typeof _json === 'undefined') {
    LOG.mark(`${colorStyle}${message}\x1b[0m`)
  } else {
    LOG.mark(`${colorStyle}${message}: ${JSON.stringify(_json)}\x1b[0m`)
  }
}

export const log = {
  reWarn: (message, _json) => genMessage(message, _json, '\x1b[30m\x1b[43m'),
  reMark: (message, _json) => genMessage(message, _json, '\x1b[37m\x1b[44m'),
  reFatal: (message, _json) => genMessage(message, _json, '\x1b[30m\x1b[41m'),
  info: message => LOG.info(message)
}


/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let DefaultOptions = {}

export const SuiteTEST = async (key, title, defaultOptions, callbacks) => {
  DefaultOptions = typeof defaultOptions === 'undefined' ? {} : defaultOptions
  describe(title, () => {
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    before(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      if(typeof callbacks !=='undefined' && typeof callbacks.before !== 'undefined')  {
        log.reMark('Iniciando-SuiteTest-BEFORE')
        await callbacks.before()
        log.reMark('Terminando-SuiteTest-BEFORE')
      }
    })
    // eslint-disable-next-line mocha/no-hooks-for-single-case
    after(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      if(typeof callbacks !=='undefined' && typeof callbacks.after !== 'undefined')  {
        log.reMark('Iniciando-SuiteTest-AFTER')
        await callbacks.after()
        log.reMark('Terminando-SuiteTest-AFTER')
      }
    })
    callbacks.tests()
  })
}

export const itREQUEST = (method, testKey, testTitle, options, callbacks) => {
  const testDesc = `${testKey}-${testTitle}`
  // LECTURA DE LAS OPCIONES

  options = typeof options === 'undefined' ? {} : options
 
  


  if (options.testIgnore) {
    log.reWarn(`Test Ignored: ${testDesc}`)
    return
  }
  
  

  // LECTURA..
  it(testDesc, done => {
    after(async () => {
      if(typeof callbacks !=='undefined' && typeof callbacks.after !== 'undefined')  {
        log.reMark('Iniciando-IT-AFTER')
        callbacks.after()  
        log.reMark('Terminando-IT-AFTER')
      }})
    before(async () => {
      if(typeof callbacks !=='undefined' && typeof callbacks.before !== 'undefined')  {
        log.reMark('Iniciando-IT-BEFORE')
        callbacks.before()  
        log.reMark('Terminando-IT-BEFORE')
      }})

    if (DefaultOptions.testIgnore !== undefined && options.testIgnore === undefined) options.testIgnore = DefaultOptions.testIgnore
    if (DefaultOptions.url !== undefined && options.url === undefined) options.url = DefaultOptions.url
    if (DefaultOptions.query !== undefined && options.query === undefined) options.query = DefaultOptions.query
    if (DefaultOptions.body !== undefined && options.body === undefined) options.body = DefaultOptions.body
    if (DefaultOptions.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOptions.listHeaders
    if (DefaultOptions.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = DefaultOptions.shouldHaveStatus

    log.reWarn(`${testDesc}-DefaultOptions.ShouldHaveStatus:`, DefaultOptions.shouldHaveStatus)
    log.reWarn(`${testDesc}-ShouldHaveStatus:`, options.shouldHaveStatus)

    let testChai = chai.request(app)
    if (method === 'post') testChai = testChai.post(options.url)
    if (method === 'get') testChai = testChai.get(options.url)
    if (typeof options.listHeaders !== 'undefined') options.listHeaders.forEach(header => testChai.set(header.name, header.value))
    if (testTitle !== undefined) testChai.set('testTitle', testTitle)
    testChai.send(options.body)
    testChai.end((err, res) => {
      if (options.shouldHaveStatus !== undefined) res.should.have.status(options.shouldHaveStatus)
      done()
    })
  })
}
export const IT = {
  Post: async (testKey, testTitle, options, callbacks) => itREQUEST('post', testKey, testTitle, options, callbacks),
  Get: async (testKey, testTitle, options, callbacks) => itREQUEST('get', testKey, testTitle, options, callbacks)
}
// export const itPOST = (testKey, testTitle, options) => itCOMMON(testKey, testTitle, options, 'post')