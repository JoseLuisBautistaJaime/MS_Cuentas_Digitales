/* eslint-disable no-console */
import MongodbMemoryServer from 'mongodb-memory-server'
import { createConnection } from '../../src/commons/connection'

let mongo
let server

export const disconectMongoDB = async () => {
  mongo.disconnect()
  server.stop()
}

export const conectMongoDB = async () => {
  server = new MongodbMemoryServer()
  process.env.URI = await server.getConnectionString()
  console.log(`Instancia de BD: ${process.env.URI}`)
  mongo = await createConnection()
}

export default null
