/* eslint-disable no-console */
import MongodbMemoryServer from 'mongodb-memory-server'
import { createConnection } from '../../src/commons/connection'

export const getMongoConnectionString = async () => {
  const mongod = new MongodbMemoryServer()
  const uri = await mongod.getConnectionString()

  process.env.URI = uri

  console.log(`Instancia de BD: ${uri}`)
  return mongod
}

let mongo
let server

export const suiteTestAfterMongoDB = async () => {
  mongo.disconnect()
  server.stop()
}

export const suiteTestBeforeMongoDB = async () => {
  server = await getMongoConnectionString()
  mongo = await createConnection()
}

export default null
