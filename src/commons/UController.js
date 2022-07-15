import { Validator } from 'jsonschema'
import LOG from './LOG'
import { CODE_UNAUTHORIZED, HEADER_AUTHORIZATION, HEADER_ID_CONSUMIDOR, HEADER_ID_DESTINO, HEADER_OAUTH, HEADER_USUARIO } from './constants'
import { HeaderRequiredException, BodyValidationException, createMessageError } from './exceptions'

const validarHeader = async (req, header) => {
  if (!req.header(header)) {
    throw new HeaderRequiredException(createMessageError(400, null, null, 'El header '.concat(header, ' es requerido')))
  }
}

const NO_TIPO = 'is not of a type(s)'
const NO_TIPO_NEW = 'no es de tipo'
const REQUERIDO = 'is required'
const REQUERIDO_NEW = 'es requerido'
const INSTANCE = 'instance.'
const MAX_INTEGER = 'must have a maximum value of'
const MIN_INTEGER = 'must have a minimum value of'
const MIN_INTEGER_VALUE = 'el valor mínimo es de'
const MAX_INTEGER_VALUE = 'el valor máximo es de'
const MAX_VARIABLE = 'does not meet maximum length of'
const MIN_VARIABLE = 'does not meet minimum length of'
const SIZE_VARIABLE = 'puede ser de una longitud máxima de'
const SIZE_MIN_VARIABLE = 'puede ser de una longitud mínima de'
const PATTERN = 'does not match pattern "^F([2-9]|1[0-2]?)$"'
const PATTERN_MSG = 'solo permiten valores de F1 a F12'

// eslint-disable-next-line camelcase
const bodyValidation_getMessages = errors => {
  let errorsFinal = ''
  errors.forEach(error => {
    let message = error.message.replace(NO_TIPO, NO_TIPO_NEW)
    message = message.replace(REQUERIDO, REQUERIDO_NEW)
    message = message.replace(MAX_INTEGER, MAX_INTEGER_VALUE)
    message = message.replace(MIN_INTEGER, MIN_INTEGER_VALUE)
    message = message.replace(MAX_VARIABLE, SIZE_VARIABLE)
    message = message.replace(MIN_VARIABLE, SIZE_MIN_VARIABLE)
    message = message.replace(PATTERN, PATTERN_MSG)

    const field = error.property.replace(INSTANCE, '')
    errorsFinal += `El campo ${field} ${message} `
  })

  return errorsFinal
}

const bodyValidation = (req, bodyValidationSchema) => {
  const VALIDATOR = new Validator()
  const validationErrors = VALIDATOR.validate(req.body, bodyValidationSchema)
  if (!validationErrors.errors.length) return
  const messageErrors = bodyValidation_getMessages(validationErrors.errors)
  throw new BodyValidationException(createMessageError(400, null, null, messageErrors))
}

/**
 * Valida los encabezados necesarios para el OAG
 *
 * @param req El request con el Header a validar.
 * @returns {Promise<void>}
 */
const validateHeaderOAG = async req => {
  await validarHeader(req, HEADER_ID_CONSUMIDOR)
  await validarHeader(req, HEADER_ID_DESTINO)
  await validarHeader(req, HEADER_USUARIO)
  await validarHeader(req, HEADER_OAUTH)
  await validarHeader(req, HEADER_AUTHORIZATION)
}

const Iniciando = async (req, tagName, evalOAG, showBody) => {
  LOG.info('')
  LOG.info('*******************************************************************')
  LOG.info(`*** CTRL: Iniciando Método ${tagName} *****************************`)
  if (req.header('TestTag')) LOG.info(`*** TestTag: ${req.header('TestTag')}`)
  LOG.info('-------------------------------------------------------------------')
  // eslint-disable-next-line no-param-reassign
  if (showBody === undefined) showBody = true
  if (showBody) LOG.info(`--Response.BODY: ${JSON.stringify(req.body)}`)
  LOG.info('-------------------------------------------------------------------')
  // eslint-disable-next-line no-param-reassign
  if (evalOAG === undefined) evalOAG = true
  if (evalOAG) await validateHeaderOAG(req)
}

const Terminando = async (res, toReturn, tagName, defaultCode) => {
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`--Request.BODY: ${JSON.stringify(toReturn)}`)
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`*** CTRL: Terminando Método ${tagName} *****************************`)
  LOG.info('********************************************************************')
  LOG.info('')
  let code
  if (defaultCode !== undefined) code = defaultCode
  else {
    code = toReturn.code
    // eslint-disable-next-line no-param-reassign
    delete toReturn.code
  }
  return res.status(code).send(toReturn)
}

const CatchError = async (res, err, tagName, defaultCode) => {
  // LOG.info(`-- Err: ${JSON.stringify(err)}`)
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`-- Error StatusCode: ${JSON.stringify(err.statusCode)}`)
  LOG.info(`-- ${err.name}(${err.code}) - ${err.message}`)
  LOG.info('-------------------------------------------------------------------')
  LOG.info(`*** CTRL: CatchError Método ${tagName} *****************************`)
  LOG.info('********************************************************************')
  LOG.info('')
  let code
  if (defaultCode !== undefined) code = defaultCode
  if (err.code !== undefined) {
    code = err.code
    // eslint-disable-next-line no-param-reassign
    delete err.code
  }
  return res.status(code).send(err)
}

async function invoke(nameMethod, req, res, evalOAG, callback) {
  try {
    await Iniciando(req, nameMethod, evalOAG, true)
    const toReturn = await callback(req, res)
    return Terminando(res, toReturn, nameMethod)
  } catch (err) {
    return CatchError(res, err, nameMethod)
  }
}

export const UController = {
  invoke
}
