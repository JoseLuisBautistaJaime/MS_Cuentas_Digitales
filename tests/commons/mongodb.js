/* eslint-disable no-console */
import MongodbMemoryServer from 'mongodb-memory-server'

export const getMongoConnectionString = async () => {
  const mongod = new MongodbMemoryServer()
  const uri = await mongod.getConnectionString()

  process.env.URI = uri

  console.log(`Instancia de BD: ${uri}`)
  return mongod
}

export default null
