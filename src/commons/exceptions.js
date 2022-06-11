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

export class NotFoundException {
  constructor(message) {
    this.name = 'Not Found'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export class ConflictException {
  constructor(message) {
    this.name = 'Conflict'
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

export class BussinessException {
  constructor(message) {
    this.name = 'Bussiness Error'
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

export class BadGatewayException {
  constructor(message) {
    this.name = 'Bad Gateway'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export class ServiceUnavailableException {
  constructor(message) {
    this.name = 'Service Unavailable'
    this.code = message.code
    this.statusCode = message.statusCode
    this.message = message.message
    this.mergeVariables = message.mergeVariables
    this.stack = new Error().stack
  }
}

export class GatewayTimeoutException {
  constructor(message) {
    this.name = 'Gateway Timeout'
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
