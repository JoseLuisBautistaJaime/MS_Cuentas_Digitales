/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
import LOG from './LOG'
import { validateBody, validateHeaderOAG, validateQuery } from './UController.Validations'
import { UCommon } from './UCommon'

const Iniciando = async (req, tagName, evalOAG, showBody, validationQuerySchema, validationBodySchema) => {
  LOG.info('')
  LOG.info('*******************************************************************')
  LOG.info(`*** CTRL: Iniciando Método ${tagName}.`)
  if (req.header('TestTag')) LOG.info(`*** TestTag: ${req.header('TestTag')}`)

  LOG.info('-------------------------------------------------------------------')
  LOG.info(`-- Request.Query: ${JSON.stringify(req.query)}`)
  if (showBody === undefined) showBody = true
  if (showBody) LOG.info(`-- Request.BODY: ${JSON.stringify(req.body)}`)
  LOG.info('-------------------------------------------------------------------')
  // eslint-disable-next-line no-param-reassign
  if (evalOAG === undefined) evalOAG = true
  if (evalOAG) await validateHeaderOAG(req)
  LOG.info(`Iniciando-isTraceEnabled: ${LOG.isTraceEnabled}`)
  LOG.info(`Iniciando-validationQuerySchema: ${JSON.stringify(validationQuerySchema)}`)
  LOG.info(`Iniciando-validationBodySchema: ${JSON.stringify(validationBodySchema)}`)
  // if (validationQuerySchema !== null && validationQuerySchema !== undefined) validateQuery(req.query, validationQuerySchema)
  // validateQuery(req.query, validationQuerySchema)
  // if (validationBodySchema !== null && validationBodySchema !== undefined) validateBody(req.body, validationBodySchema)
}

const Terminando = async (nameMethod, responseStatusCode, res, toReturn) => {
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`-- Response.StatusCode: ${responseStatusCode}`)
  LOG.info(`-- Response.BODY: ${JSON.stringify(toReturn)}`)
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`*** CTRL: Terminando Método ${nameMethod}. `)
  LOG.info  ('********************************************************************')
  LOG.info('')
  return res.status(responseStatusCode).send(toReturn)
}

const CatchError = async (nameMethod, res, err) => {
  LOG.info(`-- Err: ${JSON.stringify(err)}`)
  // const statusCode = UCommon.propGetDelete(err, 'statusCode', 500)
  // const exceptionCode = UCommon.propGetDelete(err, 'exceptionCode', 50000)
  const exceptionCode = err.exceptionCode
  const statusCode = err.statusCode
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`-- Response.StatusCode: ${statusCode}`)
  LOG.info(`-- Exception Code...: ${exceptionCode}`)
  LOG.info(`-- Exception Name...: ${err.name}`)
  LOG.info(`-- Exception Message: ${err.message}`)
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`*** CTRL: CatchError Método ${nameMethod}. `)
  LOG.info('********************************************************************')
  LOG.info('')
  return res.status(statusCode).send(err)
}

async function invoke(nameMethod, responseStatusCode, req, res, evalOAG, validationQuerySchema, validationBodySchema, callback) {
  try {
    LOG.info(`invoke-validationQuerySchema: ${JSON.stringify(validationQuerySchema)}`)
    await Iniciando(req, nameMethod, evalOAG, true, validationQuerySchema, validationBodySchema)
    const toReturn = await callback(req, res)
    return Terminando(nameMethod, responseStatusCode, res, toReturn)
  } catch (err) {
    return CatchError(nameMethod, res, err)
  }
}

export const UController = {
  invoke
}
