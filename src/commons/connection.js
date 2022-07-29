/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import cfenv from 'cfenv'
import mongoose from 'mongoose'
import { toInteger } from 'lodash'
import { log } from './cd-log'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from './constants'

const appEnv = cfenv.getAppEnv()
const { services } = appEnv
const mongoServices = services['databases-for-mongodb']
const sslInsecure = process.env.SSL_SELF_SIGNED

export const createConnection = async () => {
  const credentials = mongoServices && mongoServices.length && mongoServices[0].credentials ? mongoServices[0].credentials : null

  let uri = ''

  if (credentials) uri = credentials.connection.mongodb.composed[0]
  else uri = process.env.MONGO_URL

  let options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }

  if (sslInsecure) {
    options = {
      ...options,
      ssl: true,
      sslValidate: false
    }
  }

  options = credentials
    ? {
        ...options,
        ssl: true,
        sslValidate: true,
        sslCA: [Buffer.from(credentials.connection.mongodb.certificate.certificate_base64, 'base64')]
      }
    : options

  const instance = await mongoose.connect(`${uri}`, options)
  const db = instance.connection

  db.on('error', console.error.bind(console, 'connection error: '))
  db.once('open', () => log.info('Connection Successful'))
  db.collection('activacioneventos').createIndexes({ createdAt: 1 }, { expireAfterSeconds: toInteger(ACTIVACION_EVENTOS_TIMETOLIVE) })
  return instance
}

export default null
