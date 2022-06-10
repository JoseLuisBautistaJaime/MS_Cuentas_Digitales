// import { stringify } from 'json5'
import mongoose from 'mongoose'
import LOG from '../commons/logger'

const url = process.env.MONGO_URL
//const url = 'mongodb://localhost:27017/ms-cuentasdigitales'

if (url === undefined) {
  LOG.error('Es necesaria la variable: MONGO_URL')
  process.exit(1)
}

const certBase64 = process.env.MONGO_CERT_BASE64

if (certBase64 === undefined) {
  LOG.error('Es necesaria la variable: MONGO_CERT_BASE64')
  process.exit(1)
}

const ca = Buffer.from(certBase64, 'base64').toString('utf-8')

const mongoDbOptions = {
  ssl: true,
  sslValidate: true,
  sslCA: ca,
  poolSize: 1,
  reconnectTries: 1
}

mongoose.connect(url, mongoDbOptions)
//mongoose.connect(url)

if (mongoose.connection.readyState === 2) {
  LOG.info(`Mongo connected!!!`)
} else {
  LOG.info(`Mongo connected failed state: ${mongoose.connection.readyState}`)
}
