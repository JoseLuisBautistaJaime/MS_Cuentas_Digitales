// // import chai from 'chai'
// import { LOG } from '../../src/commons'
// // import { HEADER, TEST_CLIENTE } from './testHelpers'
// // import app from '../../src/server'
// // import { getMongoConnectionString } from './mongodb'
// // import { createConnection } from '../../src/commons/connection'
// // import { ClienteService } from '../../src/services/Cliente.Service'
// // import { TEST_CLIENTE, TEST_CLIENTE_DATA } from '../commons/testHelpers'
// // import { ActivacionEventoService } from '../../src/services/ActivacionEvento.Service'

// // let mongo
// // let server

// export const SuiteTestBEFORE = async callbackPost => {
//   LOG.reMark('Iniciando-SuiteTest-BEFORE')
//   try {
//     server = await getMongoConnectionString()
//     mongo = await createConnection()
//   } catch (err) {
//     LOG.debugJSON('error')
//   }
//   // await callbackPost()
//   LOG.reMark('Terminando-SuiteTest-BEFORE')
// }

// // export const SuiteTestAFTER = async callbackPost => {
// //   LOG.reMark('Iniciando-SuiteTest-AFTER')
// //   mongo.disconnect()
// //   server.stop()
// //   await callbackPost()
// //   LOG.reMark('Terminando-SuiteTest-AFTER')
// // }

// export const SuiteTEST = async (options, suiteTestBeforePOST, suiteTestAfterPOST, callbakTests) => {
//   const { title } = options
//   LOG.reMark(`Iniciando-SuiteTEST`, title)
//   describe('title', () => {
//     before(async () => {
//       LOG.reMark('Iniciando-SuiteTest-BEFORE')
//       await suiteTestBeforePOST()
//       LOG.reMark('Terminando-SuiteTest-BEFORE')
//     })
//     after(async () => {
//       LOG.reMark('Iniciando-SuiteTest-AFTER')
//       await suiteTestAfterPOST()
//       LOG.reMark('Terminando-SuiteTest-AFTER')
//     })
//     // callbakTests()
//   })

//   // await SuiteTestBEFORE(suiteTestBeforePOST)
//   // await SuiteTestAFTER(suiteTestAfterPOST)
//   LOG.reMark(`Terminando-SuiteTEST`, title)
// }
