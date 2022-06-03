import LOG from '../commons/logger'
import { BadRequestException, createMessageError } from '../commons/exceptions'

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

const getMessages = errors => {
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

export const handlerErrorValidation = validationErrors => {
  const message = getMessages(validationErrors.errors)
  LOG.debug('Valor mensaje:', message)
  throw new BadRequestException(
    createMessageError('NMP-API-CUENTADIGITAL-400', { message })
  )
}

export default null
