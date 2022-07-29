/* eslint-disable import/no-named-as-default */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import { log } from './pi8-controller-log'
import { validateBody, validateHeaderOAG, validateQuery, validateSchemaEMPTY } from './pi8-controller-validations'
// import { UCommon } from './UCommon'

global.mode = 33
const Iniciando = async (req, tagName, evalOAG, showBody, validationQuerySchema, validationBodySchema) => {
  log.info('')
  log.info('\x1b[36m*******************************************************************\x1b[0m')
  log.info(`\x1b[36m*** CTRL: Iniciando Método\x1b[0m ${tagName}\x1b[36m.\x1b[0m`)
  if (req.header('testDesc')) log.info(`\x1b[36m*** TestTag:\x1b[0m ${req.header('testTitle')}`)

  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')
  log.info(`\x1b[36m-- Request.Query:\x1b[0m ${JSON.stringify(req.query)}`)
  if (showBody === undefined) showBody = true
  if (showBody) log.info(`\x1b[36m-- Request.BODY:\x1b[0m ${JSON.stringify(req.body)}`)
  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')
  // eslint-disable-next-line no-param-reassign
  if (evalOAG === undefined) evalOAG = true
  if (evalOAG) await validateHeaderOAG(req)

  validateQuery(req.query, validationQuerySchema)
  validateBody(req.body, validationBodySchema)

  // LOG.info(`Iniciando-isTraceEnabled: ${LOG.isTraceEnabled}`)
  // LOG.info(`Iniciando-validationQuerySchema: ${JSON.stringify(validationQuerySchema)}`)
  // LOG.info(`Iniciando-validationBodySchema: ${JSON.stringify(validationBodySchema)}`)
  // if (validationQuerySchema !== null && validationQuerySchema !== undefined) validateQuery(req.query, validationQuerySchema)
  // validateQuery(req.query, validationQuerySchema)
  // if (validationBodySchema !== null && validationBodySchema !== undefined) validateBody(req.body, validationBodySchema)
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
  // LOG.reMark(`-- Err: ${JSON.stringify(err)}`)
  // const statusCode = UCommon.propGetDelete(err, 'statusCode', 500)
  // const exceptionCode = UCommon.propGetDelete(err, 'exceptionCode', 50000)
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

export async function invokeController(nameMethod, responseStatusCode, req, res, evalOAG, validationQuerySchema, validationBodySchema, callback) {
  try {
    if (validationQuerySchema === undefined || (validationQuerySchema === undefined) === null) validationQuerySchema = validateSchemaEMPTY
    if (validationBodySchema === undefined || (validationBodySchema === undefined) === null) validationBodySchema = validateSchemaEMPTY
    await Iniciando(req, nameMethod, evalOAG, true, validationQuerySchema, validationBodySchema)
    const toReturn = await callback(req, res)
    return Terminando(nameMethod, responseStatusCode, res, toReturn)
  } catch (err) {
    return CatchError(nameMethod, res, err)
  }
}
