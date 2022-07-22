/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { LOG } from '../src/commons'
import nock from 'nock'
import app from '../src/server'
import { CONTEXT_NAME, CONTEXT_VERSION, URL_API_COMUNICACIONES } from '../src/commons/constants'
import { getMongoConnectionString } from './commons/mongodb'
import { createConnection } from '../src/commons/connection'
import { ClienteService } from '../src/services/Cliente.Service'
import { SuiteTEST } from './commons/nmp-SuiteTEST'
import { nmpCHAI } from './commons/nmp-CHAI'
// import { clienteActivacionService } from '../src/services/clienteActivacion.Service'
import {testHelpers, HEADER, TEST_CLIENTE_DATA, TEST_CLIENTE } from './commons/testHelpers'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

let mongo
let server


const options = {
   title:'T4-Cliente.Controller' 
}
const suiteTestBEFORE = async () => {
  server = await getMongoConnectionString()
  mongo = await createConnection()
  await ClienteService.removerCliente(TEST_CLIENTE)
  await ActivacionEventoService.removerEventos(TEST_CLIENTE)
}
const suiteTestAFTER = async () => {
  await mongo.disconnect()
  await server.stop()
}

chai.use(chaiHttp).use(chaiAsPromised).should()
describe(options.title, () => {
  LOG.reMark(`Iniciando-SuiteTEST`, options.title)
  before(async () => {
    LOG.reMark('Iniciando-SuiteTest-BEFORE')
    await suiteTestBEFORE()
    LOG.reMark('Terminando-SuiteTest-BEFORE')
  })
  after(async () => {
    LOG.reMark('Iniciando-SuiteTest-AFTER')
    await suiteTestAFTER()
    LOG.reMark('Terminando-SuiteTest-AFTER')
    LOG.reMark(`Terminando-SuiteTEST`,options.title)
  })
  nmpCHAI.itPOST({
    testTag: 'T4A.0-actualizarCliente, sin OAG.',
      repiteURL: `/${CONTEXT_NAME}/${CONTEXT_VERSION}/actualizarCliente`,
      repiteBODY: TEST_CLIENTE_DATA,
      shouldHaveStatus: 400, oag: false })
  nmpCHAI.itPOST({
      testTag: 'T4A.1-actualizarCliente, cuando el cliente NO EXISTE.',
      shouldHaveStatus: 201, repiteOAG: true})
  nmpCHAI.itPOST({
    testTag: 'T4A.2-actualizarCliente, cuando el cliente SI EXISTE.',
    shouldHaveStatus: 201})
  
})
