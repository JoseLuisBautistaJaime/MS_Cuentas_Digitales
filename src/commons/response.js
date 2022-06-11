import { CODE_SUCCESS, CODE_CREATED, CODE_NO_CONTENT } from './constants'
import { MESSAGES } from './messages'

const createResponse = (res, statusCode, data = {}, code = '') => {
  let info = {}
  if (code !== '') {
    const { template: status, description: message } = MESSAGES[code]
    info = { code, status, message }
  }
  return res.status(statusCode).send({ ...data, info })
}

const Ok = (res, data) => {
  const statusCode = 200
  return createResponse(res, statusCode, data, CODE_SUCCESS)
}

const Created = (res, data) => {
  const statusCode = 201
  return createResponse(res, statusCode, data, CODE_CREATED)
}

const NoContent = res => {
  const statusCode = 204
  return createResponse(res, statusCode, {}, CODE_NO_CONTENT)
}

export const Response = {
  Ok,
  Created,
  NoContent,
  createResponse
}

export default null
