import _ from 'lodash'
import LOG from '../commons/logger'
import { Response } from '../commons/response'
import { CODE_INTERNAL_SERVER_ERROR } from '../constansts'
import {
  BadRequestException,
  InternalServerException,
  CommonException
} from '../commons/exceptions'
import { MESSAGES } from '../commons/messages'

module.exports = (res, e) => {
  LOG.error(`error: ${JSON.stringify(e)}`)

  let statusCode = 500
  let message
  if (e instanceof CommonException) {
    message = e.message
    LOG.debug(`StatusCode: ${statusCode}`)
    LOG.error(`message: ${message}`)
    return Response.createResponse(
      res,
      statusCode,
      '',
      CODE_INTERNAL_SERVER_ERROR
    )
  }

  if (e instanceof BadRequestException) statusCode = 400
  if (e instanceof InternalServerException) statusCode = 500

  const { code, mergeVariables } = e
  const { template, description } = MESSAGES[code]
  const compiled = _.template(template)

  LOG.debug(`mergeVariables: ${mergeVariables}`)
  message = compiled(mergeVariables)
  LOG.debug(`message: ${message}`)
  LOG.debug(`description: ${description}`)
  LOG.debug('Ending handlerError...')

  return Response.createResponse(
    res,
    statusCode,
    {
      code,
      message,
      description
    },
    code
  )
}
