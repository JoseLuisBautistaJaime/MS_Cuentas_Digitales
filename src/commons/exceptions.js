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

export class ValidationBodyException {
  constructor(message) {
    this.name = 'Body Validation'
    this.statusCode = 400
    this.exceptionCode = 40002
    this.message = message.message
    this.mergeVariables = null
    this.stack = null
  }
}

export class ValidationQueryException {
  constructor(message) {
    this.name = 'Query Validation'
    this.statusCode = 400
    this.exceptionCode = 40003
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
  constructor() {
    this.name = 'Verificar Otp Error'
    this.statusCode = 214
    this.exceptionCode = 21400
    this.message = 'No existe o no se ha enviado un Codigo OTP al cliente'
    this.mergeVariables = null
    this.stack = null
  }
}
