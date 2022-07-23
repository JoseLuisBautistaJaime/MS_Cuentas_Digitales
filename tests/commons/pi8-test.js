/* eslint-disable mocha/no-setup-in-describe */
import { log } from './pi8-test-log'

export const SuiteTEST = async (key, title, callbackBEFORE, callbackAFTER, callbakTESTS) => {
  describe(title, () => {
    before(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-BEFORE')
      await callbackBEFORE()
      log.reMark('Terminando-SuiteTest-BEFORE')
    })
    after(async () => {
      log.reMark(`Iniciando-SuiteTEST`, title)
      log.reMark('Iniciando-SuiteTest-AFTER')
      await callbackAFTER()
      log.reMark('Terminando-SuiteTest-AFTER')
    })
    callbakTESTS()
  })
}
