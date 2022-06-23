import LOG from './LOG'
import { BadRequestException, createMessageError } from './exceptions'
import {
  CODE_BAD_REQUEST,
  HEADER_AUTHORIZATION,
  HEADER_ID_CONSUMIDOR,
  HEADER_ID_DESTINO,
  HEADER_OAUTH,
  HEADER_USUARIO
} from './constants'

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
    let standardName = collection
      .toLowerCase()
      .trimEnd()
      .trimStart()
      .replace(/ /g, '_')
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

export const Util = {
  validateIfPositiveNumber,
  changeToCollectionStandard,
  validarHeader,
  validateHeaderOAG
}

export default null
