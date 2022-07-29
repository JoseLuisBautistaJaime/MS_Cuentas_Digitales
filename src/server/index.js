import express from 'express'
import bodyParser from 'body-parser'
import cfenv from 'cfenv'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../commons/constants'
import { createConnection } from '../commons/connection'
import { log } from '../commons/cd-log'
import appRoutes from '../routes'
import { ePRoutes } from '../routes/ePRoutes'
import { GLOBAL_CONSTANTS } from '../constants'

const app = express()
const appEnv = cfenv.getAppEnv()

const nodeEnv = process.env.NODE_ENV
const PORT = process.env.PORT || appEnv.port

if (nodeEnv !== 'production') {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Gestion de catálogos',
        description: 'NMP catálogos'
      },
      servers: [
        {
          url: `{server}/${CONTEXT_NAME}/${CONTEXT_VERSION}/${GLOBAL_CONSTANTS.EP_PREFIX}`,
          variables: {
            server: {
              default: appEnv.url
            }
          }
        }
      ]
    },
    apis: ['src/routes/ePRoutes.js']
  }

  const swaggerDocs = swaggerJsDoc(swaggerOptions)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptionsDelegate = (req, callback) => {
  const regex = new RegExp(`(http|https)://localhost`)
  const corsOptions = regex.test(req.header('Origin')) ? { origin: true } : { origin: false }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(`/${CONTEXT_NAME}/${CONTEXT_VERSION}`, appRoutes)
app.use(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/${GLOBAL_CONSTANTS.EP_PREFIX}`, ePRoutes)

createConnection()
  .then(() => {
    app.listen(PORT, appEnv.bind, () => {
      log.info(`server running on ${appEnv.url}/${CONTEXT_NAME}/${CONTEXT_VERSION}`)
      if (nodeEnv !== 'production') {
        log.info(`Swagger documentation server running on ${appEnv.url}/api-docs/`)
      }
    })
  })
  .catch(err => log.error(err))

export default app
