/* eslint-disable mocha/no-hooks-for-single-case */
/* eslint-disable mocha/no-setup-in-describe */
import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../src/commons/constants'
import { nmpCHAI } from './commons/nmpCHAI'
import { ClienteService } from '../src/services/Cliente.Service'
import { TEST_CLIENTE, TEST_CLIENTE_DATA } from './commons/testHelpers'
import { ActivacionEventoService } from '../src/services/ActivacionEvento.Service'

chai.use(chaiHttp).use(chaiAsPromised).should()
describe('T4.Cliente.Controller', () => {
  before('rootBEFORE', async () => nmpCHAI.rootBEFORE())
  after('rootAFTER', async () => nmpCHAI.rootAFTER())

  ClienteService.removerCliente(TEST_CLIENTE).then()
  ActivacionEventoService.removerEventos(TEST_CLIENTE).then()
  describe('T4. Cliente metodos básicos.', () => {
    nmpCHAI.itPOST({
      testTag: 'T4A.0-actualizarCliente, sin OAG.',
      repiteURL: `/${CONTEXT_NAME}/${CONTEXT_VERSION}/actualizarCliente`,
      repiteBODY: TEST_CLIENTE_DATA,
      shouldHaveStatus: 400,
      oag: false
    })
    nmpCHAI.itPOST({
      testTag: 'T4A.1-actualizarCliente, cuando el cliente NO EXISTE.',
      shouldHaveStatus: 201,
      repiteOAG: true
    })
    nmpCHAI.itPOST({
      testTag: 'T4A.2-actualizarCliente, cuando el cliente SI EXISTE.',
      shouldHaveStatus: 201
    })
  })
})
