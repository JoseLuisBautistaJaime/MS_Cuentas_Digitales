/* eslint-disable import/no-named-as-default */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { isEmpty } from 'lodash'
import { log } from './log'
import { validateParams, validateBody, validateHeaderOAG, validateQuery, validateSchemaEMPTY } from './validations'

const Iniciando = async (req, tagName, evalOAG, paramsSchema, querySchema, bodySchema) => {
  log.info('')
  log.info('\x1b[36m*******************************************************************\x1b[0m')
  log.info(`\x1b[36m*** CTRL: Iniciando Método\x1b[0m ${tagName}\x1b[36m.\x1b[0m`)
  if (req.header('testDesc')) log.info(`\x1b[36m*** TestTag:\x1b[0m ${req.header('testDesc')}`)
  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')
  if (!isEmpty(req.params)) log.info(`\x1b[36m-- Request.params:\x1b[0m ${JSON.stringify(req.params)}`)
  if (!isEmpty(req.query)) log.info(`\x1b[36m-- Request.query:\x1b[0m ${JSON.stringify(req.query)}`)
  if (!isEmpty(req.body)) log.info(`\x1b[36m-- Request.body:\x1b[0m ${JSON.stringify(req.body)}`)
  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')
  if (evalOAG) await validateHeaderOAG(req)
  validateParams(req.params, paramsSchema)
  validateQuery(req.query, querySchema)
  validateBody(req.body, bodySchema)
}

const Terminando = async (nameMethod, responseStatusCode, res, toReturn) => {
  const tini = '\x1b[32m'
  const tend = '\x1b[0m'

  log.info(`${tini}-------------------------------------------------------------------${tend}`)
  log.info(`${tini}-- Response.StatusCode:${tend} ${responseStatusCode}${tend}`)
  log.info(`${tini}-- Response.BODY:${tend} ${JSON.stringify(toReturn)}${tend}`)
  log.info(`${tini}-------------------------------------------------------------------${tend}`)
  log.info(`${tini}*** CTRL: Terminando Método${tend} ${nameMethod}${tini}.${tend}`)
  log.info(`${tini}********************************************************************${tend}`)
  return res.status(responseStatusCode).send(toReturn)
}

const CatchError = async (nameMethod, res, err) => {
  const exceptionCode = err.exceptionCode
  const statusCode = err.statusCode
  const colorText = statusCode >= 500 ? '\x1b[31m' : '\x1b[33m'
  if (statusCode >= 400 && statusCode < 500) {
    delete err.stack
    delete err.mergeVariables
  }

  log.info(`${colorText}-------------------------------------------------------------------\x1b[0m`)
  log.info(`${colorText}-- Response.StatusCode:\x1b[0m ${statusCode}`)
  log.info(`${colorText}-- Exception Code...:\x1b[0m ${exceptionCode}`)
  log.info(`${colorText}-- Exception Name...:\x1b[0m ${err.name}`)
  log.info(`${colorText}-- Exception Message:\x1b[0m ${err.message}`)
  log.info(`${colorText}-------------------------------------------------------------------\x1b[0m`)
  log.info(`${colorText}*** CTRL: CatchError Método\x1b[0m ${nameMethod}${colorText}.\x1b[0m `)
  log.info(`${colorText}********************************************************************\x1b[0m`)
  log.info(``)
  return res.status(statusCode).send(err)
}

export async function invokeController(nameMethod, responseStatusCode, req, res, validationSchemas, callback) {
  try {
    let { paramsSchema, querySchema, bodySchema } = validationSchemas
    if (paramsSchema === undefined) paramsSchema = validateSchemaEMPTY
    if (querySchema === undefined) querySchema = validateSchemaEMPTY
    if (bodySchema === undefined) bodySchema = validateSchemaEMPTY

    await Iniciando(req, nameMethod, true, paramsSchema, querySchema, bodySchema)
    const toReturn = await callback(req, res)
    return Terminando(nameMethod, responseStatusCode, res, toReturn)
  } catch (err) {
    return CatchError(nameMethod, res, err)
  }
}
