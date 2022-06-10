import express from 'express'
import httpContext from 'express-http-context'
import bodyParser from 'body-parser'
import cfenv from 'cfenv'
import { CONTEXT_NAME, CONTEXT_VERSION } from '../constansts'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import appRoutes from '../routes'
import { createConnection } from '../commons/connection'

const app = express()
const appEnv = cfenv.getAppEnv()
const nodeEnv = process.env.NODE_ENV

const PORT = process.env.PORT || appEnv.port

app.use(httpContext.middleware)
app.use((req, res, next) => {
  httpContext.ns.bindEmitter(req)
  httpContext.ns.bindEmitter(res)
  httpContext.set('reqId', new Date().getTime())
  next()
})

app.use(bodyParser.json({
  limit: '10000mb'
}))
app.use(bodyParser.urlencoded({
  limit: '10000mb',
  parameterLimit: 5000000,
  extended: false
}))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
  next()
})

app.use(`/${CONTEXT_NAME}/${CONTEXT_VERSION}`, appRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  if (error.status === 400) {
    res.json(Response.BadRequest(res))
  } else if (error.status === 401) {
    res.json(Response.Unauthorized(res))
  } else if (error.status === 404) {
    res.json(Response.NotFound(res))
  } else if (error.status === 502) {
    res.json(Response.InernalBadGetaway(res))
  } else {
    res.json(Response.InernalError(res))
  }
  next()
})

createConnection()
  .then(() => {
    app.listen(PORT, appEnv.bind, () => {
      LOG.info(
        `server running on ${appEnv.url}/${CONTEXT_NAME}/${CONTEXT_VERSION}`
      )
      if (nodeEnv !== 'production') {
        LOG.info(
          `Swagger documentation server running on ${appEnv.url}/api-docs/`
        )
      }
    })
  })
  .catch(err => LOG.error(err))


module.exports = app
