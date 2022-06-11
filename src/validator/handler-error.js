import _ from 'lodash'
import LOG from '../commons/LOG'
import { Response } from '../commons/response'
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerException,
  CommonException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException
} from '../commons/exceptions'
import { MESSAGES } from '../commons/messages'

export default (res, e) => {
  LOG.error(`error: ${JSON.stringify(e)}`)

  let statusCode = 500
  let message

  if (e instanceof CommonException) {
    message = JSON.parse(e.message)
    LOG.debug(`StatusCode: ${statusCode}`)
    LOG.debug(`message: ${message}`)
    return Response.createResponse(res, statusCode, message)
  }

  if (e instanceof BadRequestException) statusCode = 400
  if (e instanceof NotFoundException) statusCode = 404
  if (e instanceof ConflictException) statusCode = 409
  if (e instanceof InternalServerException) statusCode = 500
  if (e instanceof BadGatewayException) statusCode = 502
  if (e instanceof ServiceUnavailableException) statusCode = 503
  if (e instanceof GatewayTimeoutException) statusCode = 504

  const { code, mergeVariables } = e
  const { template, description } = MESSAGES[code]
  const compiled = _.template(template)
  message = compiled(mergeVariables)

  LOG.debug('Ending handlerError...')

  return Response.createResponse(res, statusCode, {
    code,
    message,
    description
  })
}
