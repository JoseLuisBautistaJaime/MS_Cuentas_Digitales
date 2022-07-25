/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable prettier/prettier */
import nock from 'nock'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'

// mocha-test-nmp-actions
import { suiteTestAfterMongoDB, suiteTestBeforeMongoDB } from './commons/pi8-test-nmp-actions-mongodb'

// mocha-test
import { SuiteTEST, itPOST } from './commons/pi8-test'
import { TEST_LISTHEADER_OAG, TEST_CLIENTE_DATA, TEST_CLIENTE } from './commons/pi8-test-nmp-constants'

// services
import { ClienteService } from '../src/services/Cliente.Service'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'


SuiteTEST('T4','actualizarCliente',
  async () => { // seccion de BEFORE
    await suiteTestBeforeMongoDB()
    await ClienteService.removerCliente(TEST_CLIENTE)
    await ActivacionEventoService.removerEventos(TEST_CLIENTE)
  }, suiteTestAfterMongoDB,

  async () => { // seccion de TESTS
    itPOST('T4A.0','actualizarCliente, sin OAG.', {
      repiteURL: `/${CONTEXT_NAME}/${CONTEXT_VERSION}/actualizarCliente`,
      repiteBODY: TEST_CLIENTE_DATA, 
      shouldHaveStatus: 400, 
      oag: false 
    }, undefined)
   
    itPOST('T4A.1','actualizarCliente, cuando el cliente NO EXISTE.', {
      repiteBODY: TEST_CLIENTE_DATA, 
      shouldHaveStatus: 201, 
      repiteOAG: false
    }, TEST_LISTHEADER_OAG)
    
    itPOST('T4A.2','actualizarCliente, cuando el cliente SI EXISTE.', {
      shouldHaveStatus: 201
    }, TEST_LISTHEADER_OAG)
}) 