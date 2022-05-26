/* eslint-disable max-classes-per-file */
export class BadRequestException {
  constructor(message) {
    this.name = 'Bad Request'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export class InternalServerException {
  constructor(message) {
    this.name = 'Internal Server Error'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export class CommonException {
  constructor(message) {
    this.name = 'Internal Server Error'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export const createMessageError = (
  code,
  mergeVariables = {},
  statusCode = null,
  message = null
) => {
  return { code, mergeVariables, statusCode, message }
}
