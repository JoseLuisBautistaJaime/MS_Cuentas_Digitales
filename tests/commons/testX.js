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
let ListCommon = {}


export const XList = {
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
      const cursorItem = XList.readFirst(list,sep)
      list = XList.removeFirst(list, sep)
      if (cursorItem !== '' && cursorItem === itemFind) return true
      if (list === '') return false
    }
  }


}

const runSubsFromList = async (listSubs, filterSub) => {
  while(true) {
    const itemSub = XList.readFirst(listSubs)
    listSubs = XList.removeFirst(listSubs)
    if (itemSub === '') return
      const canRun = (String(itemSub).indexOf(filterSub) !== -1)
      if (canRun) {
        // log.reMark(`--ListDefaultSub`, ListDefaultSub)
        // log.reMark(`--DefaultSub`, DefaultSub)
        // log.reMark(`--runSub ${filterSub}`, DefaultSub[itemSub].title)
        await DefaultSub[itemSub].sub()
      }
  }
}


export const SuiteTEST = async (key, title, configs, callbacks) => {
  // DefaultOptions = typeof defaultOptions === 'undefined' ? {} : defaultOptions
  // log.reMark(`--PASO#0-configs`,configs)
  // log.reMark(`--PASO#0-configs.listDefaultOption`,configs.listDefaultOption)
  // log.reMark(`--PASO#0-DefaultOption`,DefaultOption)


    if (configs !== undefined && configs.listDefaultOption !== undefined) ListDefaultOption[key] = configs.listDefaultOption
    if (configs !== undefined && configs.listDefaultSub !== undefined) ListDefaultSub[key] = configs.listDefaultSub
    if (configs !== undefined) ListCommon[key] = { commonHeaders : configs.commonHeaders, commonRootUrl : configs.commonRootUrl }
    // if (configs !== undefined && configs.commonRootUrl !== undefined) ListCommon[key].commonRootUrl = configs.commonRootUrl



    // log.reFatal(`--PASO#01-ListDefaultOption`,ListDefaultOption)
    // log.reFatal(`--PASO#01-ListDefaultOption[key]`,ListDefaultOption[key])
    // log.reMark(`--PASO#0-configs.listDefaultOption`,configs.listDefaultOption)

    log.reFatal(`PASO#1 SuiteTest: ${key}`)
    // log.reFatal(`PASO#1 ListDefaultSub: ${JSON.stringify(ListDefaultSub)}`)
    // log.reFatal(`PASO#1 ListDefaultOption: ${JSON.stringify(ListDefaultOption)}`)
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


export const itREQUEST = (method, keyTest, keyOption, testTitle, options, callbacks) => {
  
  // LECTURA DE LAS OPCIONES
  options = options === undefined? {} : options
  
  

  // Extraer KeyTest y Evaluar el Filtro
  // const keyTEST = XList.readFirst(listCFGS,":"); 

  const keySUITE = String(keyTest).substring(0,3)
  
  if (filterbyTest !== undefined && filterbyTest !== '') {
    const existTest = XList.existItem(filterbyTest,keyTest,":") 
    if (!existTest) return
  }
  
  // listCFGS = XList.removeFirst(listCFGS,":");

  const testDesc = `${keyTest}-${testTitle}`

  describe(keyTest, () => {
    before(async ()=> {
        // Definiendo las configuraciones de SuiteTest..        
        const optTEST = XList.readFirst(keyOption,":")
        const statusTEST = XList.removeFirst(keyOption,":")
        if (optTEST !== '') DefaultOption = ListDefaultOption[keySUITE][optTEST]
        if (options !== undefined && options.run) DefaultSub = ListDefaultSub[keySUITE]
        
        // log.reMark(`--PASO#9-ListDefaultOption`,ListDefaultOption)
        // log.reMark(`--PASO#9-ListDefaultOption`,ListDefaultOption[keySUITE][optTEST])
        log.reMark(`--PASO#9-DefaultOption`,DefaultOption)

        log.reMark(`--PASO#10`)
        // Definicion del statusRuest
        // const statusTEST = XList.readFirst(listCFGS,":")
        // listCFGS = XList.removeFirst(listCFGS,":")
        if (statusTEST !=='')  DefaultOption.shouldHaveStatus = Number(statusTEST)
        if (DefaultOption.shouldHaveStatus !== undefined && options.shouldHaveStatus === undefined) options.shouldHaveStatus = DefaultOption.shouldHaveStatus
        
        // log.reMark(`--PASO#11-DefaultOption`,DefaultOption)
        // log.reMark(`--PASO#11-options`,options)
        // Resto de elementos
        


        if (DefaultOption.url !== undefined && options.url === undefined) options.url = DefaultOption.url

        log.reFatal(`--PASO#11-options.url`, options.url)

        if (ListCommon[keySUITE].commonRootUrl !== undefined) options.url = `${ListCommon[keySUITE].commonRootUrl}${options.url}`

        if (DefaultOption.query !== undefined && options.query === undefined) options.query = DefaultOption.query
        if (DefaultOption.body !== undefined && options.body === undefined) options.body = DefaultOption.body
        
        if (ListCommon[keySUITE].commonHeaders !== undefined && DefaultOption.listHeaders === undefined) DefaultOption.listHeaders = ListCommon[keySUITE].commonHeaders

        if (DefaultOption.listHeaders !== undefined && options.listHeaders === undefined) options.listHeaders = DefaultOption.listHeaders
        
        

        // keySUITE

        log.reMark(`--PASO#12`,options )
      // Ejecicion de callbaks y runs
      const existRun = (options !==undefined && options.run !== undefined)
      const existCallbacks = (callbacks !==undefined && callbacks.before !== undefined)
  //    log.reMark(`--PASO#13`)
      if (existRun || existCallbacks) {
        // log.reMark(`--PASO#14`)
        // log.reMark('Iniciando-IT-BEFORE')
        if (existCallbacks) await callbacks.before()
        if (existRun) await runSubsFromList(options.run,'before')
        // log.reMark('Terminando-IT-BEFORE')
      }
      // log.reMark(`--PASO#15`)
    })

    
    it(testDesc, done => {
      // log.reMark(`--PASO#20`)
      // log.reMark(`--PASO#21:url`,options.url)
        let testChai = chai.request(app)
        if (method === 'post') testChai = testChai.post(options.url)
        if (method === 'get') testChai = testChai.get(options.url)
        if (method === 'delete') testChai = testChai.delete(options.url)
        if (typeof options.listHeaders !== 'undefined') options.listHeaders.forEach(header => testChai.set(header.name, header.value))
        if (testDesc !== undefined) testChai.set('testDesc', testDesc)
        if (options.query !== undefined) testChai.query(options.query)
        if (callbacks !== undefined && callbacks.send !== undefined) options.body = callbacks.send()
        // log.reMark(`--PASO#21`)

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
  PostX: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('post', keyTest,keyOption, testTitle, options, callbacks),
  GetX: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('get', keyTest, keyOption, testTitle, options, callbacks),
  DeleteX: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('delete', keyTest, keyOption, testTitle, options, callbacks)
}


