import { toInteger } from 'lodash'
import LOG from './LOG'
import { BadRequestException, createMessageError } from './exceptions'
import { CODE_BAD_REQUEST, HEADER_AUTHORIZATION, HEADER_ID_CONSUMIDOR, HEADER_ID_DESTINO, HEADER_OAUTH, HEADER_USUARIO } from './constants'

const unixTimeStamp = (fecha, addSeconds) => {
  // eslint-disable-next-line no-param-reassign
  if (addSeconds === undefined) addSeconds = 0
  return toInteger(fecha.getTime() / 1000, 10) + toInteger(addSeconds)
}



const validateIfPositiveNumber = async number => {
  LOG.info('Util validateIfPositiveNumber method')
  LOG.info(`Number: ${number}`)
  if (Number.isInteger(number * 1)) {
    if (number > 0) return true
  }
  return false
}

const changeToCollectionStandard = async collection => {
  if (collection) {
    let standardName = collection.toLowerCase().trimEnd().trimStart().replace(/ /g, '_')
    standardName = standardName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return standardName
  }
  return collection
}

/**
 * Expresión auxiliar utilizada para validar el encabezado recibido.
 *
 * @param req El request con el Header a validar.
 * @param header Encabezado con el que se valida.
 * @returns {Promise<void>}
 */
const validarHeader = async (req, header) => {
  if (!req.header(header)) {
    throw new BadRequestException(
      createMessageError(CODE_BAD_REQUEST, {
        message: 'El header '.concat(header, ' es requerido')
      })
    )
  }
}

/**
 * Expresión auxiliar utilizada para validar el parametro de query recibido.
 *
 * @param req El request con el Header a validar.
 * @param paramQuery Parametro de query con el que se valida.
 * @returns {Promise<void>}
 */
const getValidateParamQuery = (req, paramQuery) => {
  // eslint-disable-next-line prefer-destructuring, dot-notation
  if (!req.query[paramQuery]) {
    throw new BadRequestException(
      createMessageError(CODE_BAD_REQUEST, {
        message: 'El parametro de Query '.concat(paramQuery, ' es requerido')
      })
    )
  }
  return req.query[paramQuery]
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


const controllerIniciando = async (req, tagName, evalOAG, showBody) => {
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

const controllerTerminando = async (res, toReturn, tagName, defaultCode) => {
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

/** */
export const Util = {
  validateIfPositiveNumber,
  changeToCollectionStandard,
  validarHeader,
  validateHeaderOAG,
  unixTimeStamp,
  controllerTerminando,
  controllerIniciando,
  getValidateParamQuery
}

export default null
