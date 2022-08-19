/* eslint-disable max-classes-per-file */
export class ValidationHeaderException {
  constructor(message) {
    this.name = 'Header Validation'
    this.statusCode = 400
    this.exceptionCode = 40001
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class ValidationException {
  constructor(message) {
    this.name = 'Shema Validation'
    this.statusCode = 400
    this.exceptionCode = message.exceptionCode
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class NotFoundCliente {
  constructor(message) {
    this.name = 'Not Found - Cliente'
    this.statusCode = 404
    this.exceptionCode = 40404
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class InternalServerError {
  constructor(message) {
    this.name = 'Internal Server Error'
    this.statusCode = 500
    this.exceptionCode = message.exceptionCode
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class CuentaBloqueadaException {
  constructor(message) {
    this.name = 'Cuenta Bloqueada'
    this.statusCode = 203
    this.exceptionCode = message.exceptionCode
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

  export class VerificarOtpError {
  constructor(message) {
    this.name = 'Verificar Otp Error'
    this.statusCode = 214
    this.exceptionCode = message.exceptionCode
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

